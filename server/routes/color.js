const router = require("express").Router();
const Color = require("../models/color");

//  POST request
router.post("/color/:productID", async (req, res) => {
  try {
    const color = new Color();
    color.color = req.body.color;
    color.productID = req.body.productID;

    await color.save();

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
router.get("/color/:productID", async (req, res) => {
  try {
    let colors = await Color.find({
      productID: req.params.productID,
    });
    res.json({
      success: true,
      colors: colors,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

module.exports = router;
