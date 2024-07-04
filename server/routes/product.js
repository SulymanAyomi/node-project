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
    let products = Product.find().populate("category productType").limit(8);
    if (req.query.sort) {
      let sort = req.query.sort;
      products = await sortProduct(sort, products);
    } else {
      products = await products.exec();
    }
    res.json({
      success: true,
      products: products,
    });
  } catch (err) {
    console.log(err);
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

// get a products by category
router.get("/products/category/:category/", async (req, res) => {
  try {
    let category = await Category.findOne({ slug: req.params.category });
    let products = Product.find({ category: category._id }).populate(
      "category"
    );

    if (req.query.sort) {
      let sort = req.query.sort;
      products = await sortProduct(sort, products);
    } else {
      products = await products.exec();
    }
    return res.json({
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

// get a product by category and product type for men
router.get("/products/category/men/:producttype/", async (req, res) => {
  try {
    let category = await Category.findOne({ slug: "men" });
    let productType = await ProductType.findOne({
      slug: req.params.producttype,
    });
    let product = await Product.find({
      category: category._id,
      productType: productType._id,
    })
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

// get a product by category and product type for women
router.get("/products/category/women/:producttype/", async (req, res) => {
  try {
    let category = await Category.findOne({ slug: "women" });
    let productType = await ProductType.findOne({
      slug: req.params.producttype,
    });
    let product = await Product.find({
      category: category._id,
      productType: productType._id,
    })
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

// get a product by category and product type for kids
router.get("/products/category/kids/:producttype/", async (req, res) => {
  try {
    let category = await Category.findOne({ slug: "kids" });
    let productType = await ProductType.findOne({
      slug: req.params.producttype,
    });
    let product = await Product.find({
      category: category._id,
      productType: productType._id,
    })
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
    if (productType) {
      let product = await Product.find({
        productType: productType._id,
      })
        .populate("category")
        .exec();
      return res.json({
        success: true,
        products: product,
      });
    } else {
      return res.json({
        success: true,
        products: [],
      });
    }
  } catch (err) {
    console.log(err);
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

async function sortProduct(sort, product) {
  if (sort == "AlphaPlus") {
    return await product.sort({ title: +1 }).exec();
  } else if (sort == "AlphaMinus") {
    return await product.sort({ title: -1 }).exec();
  } else if (sort == "PricePlus") {
    return await product.sort({ price: +1 }).exec();
  } else if (sort == "PriceMinus") {
    return await product.sort({ price: -1 }).exec();
  } else if (sort == "DatePlus") {
    return product.sort({ updatedAt: +1 }).exec();
  } else if (sort == "DateMinus") {
    return product.sort({ updatedAt: -1 }).exec();
  } else {
    return product.exec();
  }
}

module.exports = router;
