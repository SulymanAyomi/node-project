const router = require("express").Router();
const Brand = require("../models/brand");
const slugify = require("slugify");
const adminToken = require("../middlewares/admin-token");

//  POST request
router.post("/brands", adminToken, async (req, res) => {
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
router.get("/brands", adminToken, async (req, res) => {
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

// update request

router.put("/brands/:id", adminToken, async (req, res) => {
  try {
    let brands = await Brand.findOneAndUpdate(
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
      updatedbrands: brands,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// DELETE request

router.delete("/brands/:id", adminToken, async (req, res) => {
  try {
    let deletedBrand = await Brand.findOneAndDelete({ _id: req.params.id });

    if (deletedBrand) {
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
