// jsonwebtoken bcrypt-nodejs --save

const router = require("express").Router();
const User = require("../models/user");
const Order = require("../models/order");
const nodemailer = require("nodemailer");
const upload = require("../middlewares/upload-photos");
const jwt = require("jsonwebtoken");
const verifyToken = require("../middlewares/verify-token");
const adminToken = require("../middlewares/admin-token");

const transport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "sulymanayomi@gmail.com",
    pass: "sdsdk",
  },
});

sendConfirmationEmail = (name, email, token) => {
  console.log("Check");
  transport
    .sendMail({
      from: user,
      to: email,
      subject: "Please confirm your account",
      html: `<h1>Email Confirmation</h1>
        <h2>Hello ${name}</h2>
        <p>Thank you for subscribing. Please confirm your email by clicking on the following link</p>
        <a href=http://localhost:3000/account/verify/${token}> Click here</a>
        </div>`,
    })
    .catch((err) => console.log(err));
};

// singup route
router.post("/auth/signup", upload.single("photo"), async (req, res) => {
  if (!req.body.email || !req.body.password) {
    res
      .status(400)
      .json({ success: false, message: "Please enter email or password" });
  } else {
    try {
      let photo = "";
      if (req.file) {
        photo = req.file.location;
      }
      console.log(req.body);

      let newUser = new User({ ...req.body, photo: photo });
      await newUser.save();
      res.json({
        success: true,
        message: "User was registered successfully",
      });
    } catch (err) {
      console.log(err);
      res.status(400);
      res.status(500).json({
        success: false,
        message: "Server error. Try again",
      });
    }
  }
});

// verify email
router.post("/auth/signup/verify", async (req, res) => {
  try {
    token = req.body.token;
    jwt.verify(token, process.env.SECRET, (err, decoded) => {
      if (err) {
        res.json({
          success: false,
          message: "Failed to authenticate",
        });
      } else {
        req.decoded = decoded;
        next();
      }
    });
    let foundUser = await User.findOne({ _id: req.decoded._id });
    if (foundUser) {
      foundUser.status = "Active";
      await foundUser.save();
      res.json({
        success: true,
        message: "Email verified",
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// profile routes
router.get("/auth/user", adminToken, async (req, res) => {
  try {
    let foundUser = await User.findOne({ _id: req.decoded._id });
    if (foundUser) {
      res.json({
        success: true,
        user: foundUser,
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// update a profile

router.put("/auth/users", verifyToken, async (req, res) => {
  try {
    let foundUser = await User.findOne({ _id: req.decoded._id });

    if (foundUser) {
      if (req.body.name) foundUser.name = req.body.name;
      if (req.body.email) foundUser.email = req.body.email;
      if (req.body.password) foundUser.password = req.body.password;

      await foundUser.save();

      res.json({
        success: true,
        message: "Successfully updated",
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// admin login
router.post("/auth/login", async (req, res) => {
  try {
    let foundUser = await User.findOne({ email: req.body.email });
    if (!foundUser) {
      res.status(403).json({
        success: false,
        message: "Authourization failed, User not found",
      });
    } else if (!foundUser.admin) {
      res.status(401).json({
        success: false,
        message: "You do not have authourization to use this app!",
      });
    } else {
      if (foundUser.comparePassword(req.body.password)) {
        let token = jwt.sign(foundUser.toJSON(), process.env.SECRET, {
          expiresIn: 604800, // 1 week
        });

        res.json({ success: true, token: token });
      } else {
        res.status(403).json({
          success: true,
          message: "Authourization failed, wrong password",
        });
      }
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// get all user
router.get("/auth/users", adminToken, async (req, res) => {
  try {
    let foundUser = await User.find();
    if (foundUser) {
      res.json({
        success: true,
        user: foundUser,
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});
// profile routes
router.get("/auth/user/:id", adminToken, async (req, res) => {
  try {
    let foundUser = await User.findOne({ _id: req.params.id });
    const { _id } = foundUser;
    const orders = await Order.find({ user: req.params.id });
    if (foundUser) {
      res.json({
        success: true,
        user: foundUser,
        orders,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});
module.exports = router;
