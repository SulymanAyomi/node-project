const router = require("express").Router();
const Category = require("../models/category");
const Product = require("../models/product");
const slugify = require("slugify");
const adminToken = require("../middlewares/admin-token");

//  POST request
router.post("/categories/", adminToken, async (req, res) => {
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
router.get("/categories/", adminToken, async (req, res) => {
  try {
    let categories = await Category.find();
    const list = await Promise.all(
      categories.map(async (category) => {
        const count = await Product.countDocuments({
          category: category._id,
        });

        return {
          category,
          count,
        };
      })
    );
    res.json({
      success: true,
      categories: list,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// GET a single rquest
router.get("/categories/:id/", adminToken, async (req, res) => {
  try {
    let category = await Category.findOne({ _id: req.params.id });
    res.json({
      success: true,
      categories: category,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// update

router.put("/categories/:id/", adminToken, async (req, res) => {
  try {
    let categories = await Category.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          type: req.body.type,
        },
      },
      { upsert: true }
    );
    res.json({
      success: true,
      updatedcategories: categories,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// DELETE request

router.delete("/categories/:id/", adminToken, async (req, res) => {
  try {
    let deletedCategory = await Category.findOneAndDelete({
      _id: req.params.id,
    });

    if (deletedCategory) {
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

module.exports = router;
