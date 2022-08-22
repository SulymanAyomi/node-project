const router = require("express").Router();
const verfityToken = require("../middlewares/verify-token");
const Address = require("../models/address");
const User = require("../models/user");
const axios = require("axios");

//  POST request

router.post("/addresses", verfityToken, async (req, res) => {
  console.log(req.body);

  try {
    const address = new Address();
    address.user = req.decoded._id;
    address.firstName = req.firstName;
    address.lastName = req.lastName;
    address.state = req.body.state;
    address.city = req.body.city;
    address.streetAddress = req.body.streetAddress;
    address.zipCode = req.body.zipCode;
    address.phoneNumber = req.body.phoneNumber;
    address.deliveryInstructions = req.body.deliveryInstructions;
    await address.save();

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

//get

router.get("/addresses", verfityToken, async (req, res) => {
  try {
    let addresses = await Address.find({ user: req.decoded._id });
    res.json({
      success: true,
      addresses: addresses,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

router.get("/state", async (req, res) => {
  try {
    let result = await axios.get(
      "https://nigerian-states-info.herokuapp.com/api/v1/states"
    );
    res.json({
      success: true,
      addresses: result.data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

router.put("/address/:id", verfityToken, async (req, res) => {
  try {
    let foundAddress = await Address.findOne({ _id: req.params._id });
    if (foundAddress) {
      if (req.body.firstName) foundAddress.firstName = req.firstName;
      if (req.body.lastName) foundAddress.lastName = req.lastName;
      if (req.body.state) foundAddress.state = req.body.state;
      if (req.body.city) foundAddress.city = req.body.city;
      if (req.body.streetAddress)
        foundAddress.streetAddress = req.body.streetAddress;
      if (req.body.zipCode) foundAddress.zipCode = req.body.zipCode;
      if (req.body.phoneNumber) foundAddress.phoneNumber = req.body.phoneNumber;
      if (req.body.deliveryInstructions)
        foundAddress.deliveryInstructions = req.body.deliveryInstructions;

      await foundAddress.save();

      res.json({
        success: true,
        message: "successfully update the address",
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

router.delete("/address/:id", verfityToken, async (req, res) => {
  try {
    let deleteAddress = await Address.remove({
      user: req.decoded._id,
      _id: req.params.id,
    });

    if (deleteAddress) {
      res.json({
        success: true,
        message: "Address has been deleted",
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// set default address
router.put("/addresses/set/default", verfityToken, async (req, res) => {
  try {
    const dec = await User.findOneAndUpdate(
      { _id: req.decoded._id },
      { $set: { address: req.body.id } }
    );
    if (dec) {
      res.json({
        success: true,
        message: "Address has been set as default",
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
