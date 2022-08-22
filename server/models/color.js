const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ColorSchema = new Schema({
  productID: { type: Schema.Types.ObjectID, ref: "Product" },
  color: String,
});

module.exports = mongoose.model("Color", ColorSchema);
