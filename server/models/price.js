const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PriceSchema = new Schema({
  productID: { type: Schema.Types.ObjectId, ref: "Product" },
  price: Number,
  size: String,
});

module.exports = mongoose.model("Price", PriceSchema);
