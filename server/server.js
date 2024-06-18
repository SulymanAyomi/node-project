const express = require("express");
const morgan = require("morgan");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize");

dotenv.config();

const app = express();
mongoose.connect(process.env.DATABASEOFF, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("connected to the database");
  }
});

mongoose.connection.on("error", (err) => {
  console.log(err, "connection error");
});
// middleware
app.use(mongoSanitize());
app.use(cors());
app.use(morgan("dev"));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));

// require apis
const productRoutes = require("./routes/product");
const categoryRoutes = require("./routes/category");
const userRoutes = require("./routes/auth");
const reviewRoutes = require("./routes/review");
const addressRoutes = require("./routes/address");
const productTypeRoutes = require("./routes/productType");
const brandRoutes = require("./routes/brand");
const payment = require("./routes/payment");
const order = require("./routes/order");
// const search = require("./routes/search");
const adminProduct = require("./admin/product");
const adminCategory = require("./admin/category");
const adminBrand = require("./admin/brand");
const adminProductType = require("./admin/productType");
const adminProductAddress = require("./admin/address");
const adminAuth = require("./admin/auth");
const adminOrder = require("./admin/order");

//  app route
app.use("/api", categoryRoutes);
app.use("/api", productRoutes);
app.use("/api", userRoutes);
app.use("/api", reviewRoutes);
app.use("/api", addressRoutes);
app.use("/api", addressRoutes);
app.use("/api", productTypeRoutes);
app.use("/api", payment);
app.use("/api", brandRoutes);
app.use("/api", order);
// app.use("/api", search);

// admin route
app.use("/api/admin", adminProduct);
app.use("/api/admin", adminCategory);
app.use("/api/admin", adminProductType);
app.use("/api/admin", adminBrand);
app.use("/api/admin", adminProductAddress);
app.use("/api/admin", adminAuth);
app.use("/api/admin", adminOrder);

app.listen(4000, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("listening on port 4000");
  }
});
