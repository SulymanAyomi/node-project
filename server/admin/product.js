const router = require("express").Router();
const Product = require("../models/product");
const Order = require("../models/order");
const Review = require("../models/review");
const uploadImage = require("../middlewares/upload");
const slugify = require("slugify");
const Category = require("../models/category");
const Brand = require("../models/brand");
const ProductType = require("../models/productType");
const adminToken = require("../middlewares/admin-token");
const verifyToken = require("../middlewares/verify-token");
const multer = require("multer"); // for handling file uploads

// POST request - create a new product

// title: String,
// description: String,
// photo: String,
// price: Number,
// stockQuantity: Number,
// rating: [Number],

// upload.single("photo")

const upload = multer({ dest: "uploads/" });
router.post(
  "/products",
  [adminToken, upload.single("photo"), uploadImage],
  async (req, res) => {
    try {
      console.log(req.file.location);
      let product = new Product();
      product.title = req.body.title;
      product.slug = slugify(req.body.title.toLowerCase());
      product.description = req.body.description;
      product.photo = req.file.location;
      product.stockQuantity = req.body.stockQuantity;
      product.category = req.body.categoryID;
      product.weight = req.body.weight;
      product.brand = req.body.brandID;
      product.material = req.body.material;
      product.productType = req.body.productTypeID;
      product.color.push(req.body.color);
      product.price.XS = req.body.XS;
      product.price.S = req.body.S;
      product.price.M = req.body.M;
      product.price.L = req.body.L;
      product.price.XL = req.body.XL;

      await product.save();

      res.json({
        success: true,
        message: "Successfully saved",
        product: product,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }
);

// GET request - get all product
router.get("/products", verifyToken, async (req, res) => {
  try {
    let products = await Product.find().populate("category").exec();
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

// Get product by name
router.get("/products/order", verifyToken, async (req, res) => {
  try {
    const fin = "^" + req.query.name;
    let products = await Product.find({
      title: { $regex: fin, $options: "i" },
    }).lean();
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

// GET request - get a single product

router.get("/products/:id", verifyToken, async (req, res) => {
  try {
    let product = await Product.findById({ _id: req.params.id })
      .populate("category")
      .populate("productType brand")
      .exec();
    const order = await Order.find({ "products.productID": req.params.id });
    // .populate("owner")
    // .exec();
    res.json({
      success: true,
      product: product,
      order,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// get a product by category
router.get("/products/category/:category", adminToken, async (req, res) => {
  try {
    let category = await Category.findOne({ slug: req.params.category });
    let product = await Product.find({ category: category._id })
      .populate("category")
      .exec();
    res.json({
      success: true,
      product: product,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// get a product by brand
router.get("/products/category/:brand", async (req, res) => {
  try {
    let brand = await Brand.findOne({ slug: req.params.brand });
    let product = await Product.find({ category: brand._id })
      .populate("category")
      .exec();
    res.json({
      success: true,
      product: product,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// get a product by producttype
router.get("/products/category/:producttype", async (req, res) => {
  try {
    let productType = await ProductType.findOne({
      slug: req.params.producttype,
    });
    let product = await Product.find({ category: productType._id })
      .populate("category")
      .exec();
    res.json({
      success: true,
      product: product,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// PUT request - Update a single product

router.put(
  "/products/:id",
  [adminToken, upload.single("photo")],
  async (req, res) => {
    console.log(req.body);
    try {
      let product = await Product.findOneAndUpdate(
        { _id: req.params.id },
        {
          $set: {
            title: req.body.title,
            slug: slugify(req.body.title.toLowerCase()),
            price: req.body.price,
            category: req.body.categoryID,
            photo: req.file.location,
            description: req.body.description,
            weight: req.body.weight,
            brand: req.body.brandID,
            stockQuantity: req.body.stockQuantity,
            productType: req.body.productType,
          },
        },
        { upsert: true }
      );

      res.json({
        success: true,
        updatedproduct: product,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }
);

// DELETE request - delete a single product

router.delete("/products/:id", adminToken, async (req, res) => {
  try {
    let deletedProduct = await Product.findOneAndDelete({ _id: req.params.id });

    if (deletedProduct) {
      res.json({
        success: true,
        message: "Successfully deleted",
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// get review
router.get("/reviews/:productID", async (req, res) => {
  try {
    const productReviews = await Review.find({
      productID: req.params.productID,
    })
      .populate("users")
      .exec();

    res.json({
      success: true,
      reviews: productReviews,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// get total available products

module.exports = router;
