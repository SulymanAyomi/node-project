// jsonwebtoken bcrypt-nodejs --save

const router = require("express").Router();
const User = require("../models/user");
const nodemailer = require("nodemailer");

const jwt = require("jsonwebtoken");
const verifyToken = require("../middlewares/verify-token");

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
router.post("/auth/signup", async (req, res) => {
  if (!req.body.email || !req.body.password) {
    res.json({ success: false, message: "Please enter email or password" });
  } else {
    try {
      email = await User.findOne({ email: req.body.email });
      // validation
      if (email) {
        console.log("tr");
        res.json({
          success: false,
          message: "Email already exist",
        });
        return;
      }

      let newUser = new User();
      newUser.name = req.body.name;
      newUser.email = req.body.email;
      newUser.password = req.body.password;
      //  check if user is an admin
      if (req.body.secretKey == process.env.ADMIN) {
        newUser.admin = true;
        newUser.status = "Active";
        await newUser.save();
        let token = jwt.sign(newUser.toJSON(), process.env.SECRET, {
          expiresIn: 604800, // 1 week
        });
        return res.json({
          success: true,
          token: token,
          message: "Successfully created a new admin user",
        });
      }

      await newUser.save();

      let token = jwt.sign(newUser.toJSON(), process.env.SECRET, {
        expiresIn: 604800, // 1 week
      });

      // nodemailer.sendConfirmationEmail(newUser.name, newUser.email, token);

      res.json({
        success: true,
        message: "User was registered successfully! Please check your mail",
      });
    } catch (err) {
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
router.get("/auth/user", verifyToken, async (req, res) => {
  try {
    let foundUser = await User.findOne({ _id: req.decoded._id })
      .populate("address")
      .exec();
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

router.put("/auth/user", verifyToken, async (req, res) => {
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

// Login Routes
router.post("/auth/login", async (req, res) => {
  try {
    let foundUser = await User.findOne({ email: req.body.email });
    if (!foundUser) {
      res.status(403).json({
        success: false,
        message: "Authourization failed, User not found",
      });
      return;

      // if (foundUser.status != "Active") {
      //   return res.status(401).send({
      //     success: false,
      //     message: "Pending Account. Please Verify Your Email!",
      //   });
      // }
    }
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
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// admin login
router.post("/auth/admin/login", async (req, res) => {
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
        message: "Authourization failed, User not allowed",
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

module.exports = router;
