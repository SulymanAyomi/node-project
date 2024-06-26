const router = require("express").Router();
const ProductType = require("../models/productType");
const Product = require("../models/product");
const slugify = require("slugify");
const adminToken = require("../middlewares/admin-token");

//  POST request
router.post("/producttypes/", adminToken, async (req, res) => {
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
router.get("/producttypes/", async (req, res) => {
  try {
    let productTypes = await ProductType.find();
    const list = await Promise.all(
      productTypes.map(async (productType) => {
        const count = await Product.countDocuments({
          productType: productType._id,
        });

        return {
          productType,
          count,
        };
      })
    );

    res.json({
      success: true,
      productTypes: list,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// update request
router.put("/producttypes/:id/", async (req, res) => {
  try {
    let productTypes = await ProductType.findOneAndUpdate(
      {
        _id: req.params.id,
      },
      {
        $set: {
          type: req.body.type,
        },
      },
      { upsert: true }
    );
    res.json({
      success: true,
      updateproductTypes: productTypes,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// DELETE request

router.delete("/producttypes/:id/", adminToken, async (req, res) => {
  try {
    let deletedProductType = await ProductType.findOneAndDelete({
      _id: req.params.id,
    });

    if (deletedProductType) {
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
