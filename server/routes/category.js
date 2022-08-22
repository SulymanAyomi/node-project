const router = require("express").Router();
const Category = require("../models/category");
const slugify = require("slugify");

//  POST request
router.post("/categories", async (req, res) => {
  console.log(req.body);
  try {
    const category = new Category();
    category.type = req.body.type;
    category.slug = slugify(req.body.type.toLowerCase());

    await category.save();

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
router.get("/categories", async (req, res) => {
  try {
    let categories = await Category.find();
    res.json({
      success: true,
      categories: categories,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

module.exports = router;
