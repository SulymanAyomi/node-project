const router = require("express").Router();
const ProductType = require("../models/productType");
const slugify = require("slugify");

// GET rquest
router.get("/producttypes/", async (req, res) => {
  try {
    let productTypes = await ProductType.find();
    res.json({
      success: true,
      productTypes: productTypes,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

module.exports = router;
