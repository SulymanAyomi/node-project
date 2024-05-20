const router = require("express").Router();
const Product = require("../models/product");
const Review = require("../models/review");
const upload = require("../middlewares/upload-photos");
const slugify = require("slugify");
const Category = require("../models/category");
const Brand = require("../models/brand");
const ProductType = require("../models/productType");

// POST request - create a new product

// title: String,
// description: String,
// photo: String,
// price: Number,
// stockQuantity: Number,
// rating: [Number],

// GET request - get all product
router.get("/products/", async (req, res) => {
  try {
    let products = await Product.find()
      .populate("category productType")
      .limit(8)
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

router.get("/products/popularproducts/", async (req, res) => {
  try {
    let products = await Product.find()
      .populate("category productType")
      .limit(8)
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
// GET request - get a single product

router.get("/products/:slug/", async (req, res) => {
  try {
    let product = await Product.findOne({ slug: req.params.slug })
      .populate("category")
      .populate("productType brand")
      .populate("reviews", "rating")
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

// get a product by category
router.get("/products/category/:category/", async (req, res) => {
  try {
    let category = await Category.findOne({ slug: req.params.category });
    let product = await Product.find({ category: category._id })
      .populate("category")
      .exec();
    res.json({
      success: true,
      products: product,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// get a product by brand
router.get("/products/brand/:brand/", async (req, res) => {
  try {
    let brand = await Brand.findOne({ slug: req.params.brand });
    let product = await Product.find({ brand: brand._id })
      .populate("category")
      .exec();
    res.json({
      success: true,
      products: product,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// get a product by producttype
router.get("/products/producttype/:type/", async (req, res) => {
  try {
    let productType = await ProductType.findOne({
      slug: req.params.type,
    });
    let product = await Product.find({
      productType: productType._id,
    })
      .populate("category")
      .exec();
    console.log(product);
    res.json({
      success: true,
      products: product,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// PUT request - Update a single product

router.put("/products/:id/", async (req, res) => {
  console.log(req.body);
  try {
    let product = await Product.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          title: req.body.title,
          price: req.body.price,
          category: req.body.category,
          // photo: req.file.location,
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
});

// DELETE request - delete a single product

router.delete("/products/:id/", async (req, res) => {
  try {
    let deletedProduct = await Product.findOneAndDelete({ _id: req.params.id });

    if (deletedProduct) {
      res.json({
        status: true,
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
router.get("/reviews/:productID/", async (req, res) => {
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

module.exports = router;
