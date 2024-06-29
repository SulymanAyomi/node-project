// jsonwebtoken bcrypt-nodejs --save
// const passport = require("passport");
// const GoogleStrategy = require("passport-google-oauth20").Strategy;
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
    return res.status(403).json({
      success: false,
      message: "Please enter email or password",
    });
  }

  try {
    email = await User.findOne({ email: req.body.email });
    // validation
    if (email) {
      return res.status(403).json({
        success: false,
        message: "Email already exist",
      });
    }

    let newUser = new User();
    newUser.name = req.body.name;
    newUser.email = req.body.email;
    newUser.password = req.body.password;

    await newUser.save();
    const { password, ...user } = newUser;
    let token = jwt.sign(user, process.env.SECRET, {
      expiresIn: 604800, // 1 week
    });

    // nodemailer.sendConfirmationEmail(newUser.name, newUser.email, token);

    res.json({
      success: true,
      message: "User was registered successfully!",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again",
    });
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
    console.log(req.decoded);
    let user = await User.findOne({ _id: req.decoded._id })
      .populate("address")
      .exec();
    if (user) {
      const { password, ...foundUser } = user.toObject();
      res.status(200).json({
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

// Login Routes
router.post("/auth/login", async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(403).json({
        success: false,
        message: "Invalid email address or password",
      });

      // if (foundUser.status != "Active") {
      //   return res.status(401).send({
      //     success: false,
      //     message: "Pending Account. Please Verify Your Email!",
      //   });
      // }
    }
    if (user.comparePassword(req.body.password)) {
      const { password, ...foundUser } = user.toObject();
      console.log(foundUser);

      let token = jwt.sign(foundUser, process.env.SECRET, {
        expiresIn: 604800, // 1 week
      });

      res.status(200).json({ success: true, token: token });
    } else {
      res.status(403).json({
        success: true,
        message: "Invalid email address or password",
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

// Google routes
// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       callbackURL: "/auth/google/callback",
//     },
//     (accessToken, refreshToken, profile, done) => {
//       return done(null, profile);
//     }
//   )
// );

// app.get(
//   "/auth/google",
//   passport.authenticate("google", {
//     scope: ["profile", "email"],
//   })
// );

// app.get(
//   "/auth/google/callback",
//   passport.authenticate("google", { session: false }),
//   (req, res) => {
//     const token = jwt.sign({ user: req.user }, process.env.JWT_SECRET, {
//       expiresIn: "1h",
//     });
//     res.redirect(`http://localhost:8080/profile?token=${token}`);
//   }
// );

// app.post("/profile", (req, res) => {
//   const token = req.headers.authorization.split(" ")[1];
//   jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//     if (err) {
//       return res.status(401).send("Unauthorized");
//     }
//     res.send(decoded.user);
//   });
// });

module.exports = router;
