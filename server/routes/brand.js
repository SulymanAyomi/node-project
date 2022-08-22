const router = require("express").Router();
const Brand = require("../models/brand");
const slugify = require("slugify");

//  POST request
router.post("/brands", async (req, res) => {
  try {
    const brand = new Brand();
    brand.type = req.body.type;
    brand.slug = slugify(req.body.type.toLowerCase());

    await brand.save();

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
router.get("/brands", async (req, res) => {
  try {
    let brands = await Brand.find();
    res.json({
      success: true,
      brands: brands,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

module.exports = router;
