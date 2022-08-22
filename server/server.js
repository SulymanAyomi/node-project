const express = require("express");
const morgan = require("morgan");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();
mongoose.connect(process.env.DATABASEON, (err) => {
  if (err) {
    console.log(err);
    process.exit();
  } else {
    console.log("connected to the database");
  }
});

mongoose.connection.on("error", (err) => {
  console.log(err, "connection error");
});
// middleware
app.use(cors());
app.use(morgan("dev"));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));

// require apis
const productRoutes = require("./routes/product");
const categoryRoutes = require("./routes/category");
const ownerRoutes = require("./routes/owner");
const userRoutes = require("./routes/auth");
const reviewRoutes = require("./routes/review");
const addressRoutes = require("./routes/address");
const productTypeRoutes = require("./routes/productType");
const brandRoutes = require("./routes/brand");
const payment = require("./routes/payment");
const order = require("./routes/order");
const search = require("./routes/search");

app.use("/api", categoryRoutes);
app.use("/api", productRoutes);
app.use("/api", ownerRoutes);
app.use("/api", userRoutes);
app.use("/api", reviewRoutes);
app.use("/api", addressRoutes);
app.use("/api", addressRoutes);
app.use("/api", productTypeRoutes);
app.use("/api", payment);
app.use("/api", brandRoutes);
app.use("/api", order);
app.use("/api", search);

app.listen(4000, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("listening on port 3001");
  }
});
