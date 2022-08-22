const router = require("express").Router();
const Owner = require("../models/owner");

//  POST request
// name: String,
// about: String,
// photo: String,
router.post("/owners", async (req, res) => {
  try {
    const owner = new Owner();
    owner.about = req.body.about;
    owner.user = req.body.userID;
    owner.storeName = req.body.storeName;
    owner.number = req.body.number;
    // owner.photo = req.file.location

    await owner.save();

    res.json({
      status: true,
      message: "New Owner Successfully saved",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// GET rquest
router.get("/owners", async (req, res) => {
  try {
    let owners = await Owner.find().populate("user", "name").exec();
    res.json({
      success: true,
      owners: owners,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

module.exports = router;
