const router = require("express").Router();
const Order = require("../models/order");
const User = require("../models/user");
const Product = require("../models/product");
const verifyToken = require("../middlewares/verify-token");
const today = new Date();

router.get("/orders", verifyToken, async (req, res) => {
  try {
    let orders = await Order.find()
      .populate({
        path: "products",
        populate: {
          path: "productID",
        },
      })
      .populate("receiver user")
      .exec();
    let count = await Order.countDocuments({
      createdAt: {
        $gte: today.setHours(0, 0, 0),
      },
    });
    let pending = await Order.countDocuments({
      status: "Paid",
    });
    let delivery = await Order.countDocuments({
      estimateDelivery: {
        $gte: today.setHours(0, 0, 0),
        $lte: today.setHours(23),
      },
    });
    others = { count, pending, delivery };
    res.json({
      success: true,
      orders,
      others,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// home page
router.get("/orders/home", verifyToken, async (req, res) => {
  try {
    let orders = await Order.find()
      .limit(10)
      .populate({
        path: "products",
        populate: {
          path: "productID",
        },
      })
      .populate("receiver user")
      .exec();
    let ordercount = await Order.estimatedDocumentCount();
    let product = await Product.estimatedDocumentCount();
    let user = await User.estimatedDocumentCount();
    let order = await Order.find();
    let earnings = order.reduce((acc, order) => acc + order.total, 0);
    others = { ordercount, product, user, earnings, order };
    res.json({
      success: true,
      orders,
      others,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

router.get("/orders/:id", verifyToken, async (req, res) => {
  try {
    let order = await Order.findById(req.params.id)
      .populate({
        path: "products",
        populate: {
          path: "productID",
        },
      })
      .populate("user receiver")
      .exec();
    res.json({
      success: true,
      order,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

router.post("/orders/home", verifyToken, async (req, res) => {
  try {
    let order = new Order();
    console.log(req.body);
    let cart = req.body.cart;

    cart.map((product) => {
      order.products.push({
        productID: product._id,
        quantity: parseInt(product.quantity),
        price: product.orderPrice,
        size: product.orderSize,
      });
    });

    order.user = req.decoded._id;
    order.estimateDelivery = req.body.estimateDelivery;
    order.status = req.body.status;
    order.total = req.body.total;
    order.receiver = req.decoded._id;
    order.payment = req.body.payment;
    order.quantityBought = req.body.quantityBought;
    await order.save();
    res.json({
      success: true,
      message: "Order successfully created",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});
router.put("/orders/:id", verifyToken, async (req, res) => {
  try {
    let newUser = Order.findByIdAndUpdate({ ...req.params.id });
    await newUser.save();
    res.json({
      success: true,
      message: "Order successfully created",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});
module.exports = router;
