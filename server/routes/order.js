const router = require("express").Router();
const Order = require("../models/order");
const verifyToken = require("../middlewares/verify-token");

router.get("/orders", verifyToken, async (req, res) => {
  try {
    let products = await Order.find({ user: req.decoded._id })
      .populate({
        path: "products",
        populate: {
          path: "productID",
        },
      })
      .exec();
    res.json({
      success: true,
      products: products,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

module.exports = router;
