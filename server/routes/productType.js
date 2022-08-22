const router = require("express").Router();
const ProductType = require("../models/productType");
const slugify = require("slugify");

//  POST request
router.post("/producttype", async (req, res) => {
  try {
    const productType = new ProductType();
    productType.type = req.body.type;
    productType.slug = slugify(req.body.type.toLowerCase());

    await productType.save();

    res.json({
      status: true,
      message: "Successfully saved",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// GET rquest
router.get("/producttype", async (req, res) => {
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
