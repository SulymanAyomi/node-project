const router = require("express").Router();
const Price = require("../models/price");

//  POST request
router.post("/price/:productID", async (req, res) => {
  try {
    const price = new Price();
    price.productID = req.params.productID;
    price.price = req.body.price;
    price.size = req.body.size;

    await price.save();

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
router.get("/price/:productID", async (req, res) => {
  try {
    let price = await Price.find({
      productID: req.params.productID,
    });

    res.json({
      success: true,
      price: price,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

module.exports = router;
