const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
  owner: { type: Schema.Types.ObjectId, ref: "User" },
  products: [
    {
      productID: { type: Schema.Types.ObjectId, ref: "Product" },
      quantity: Number,
      price: Number,
    },
  ],
  estimateDelivery: String,
  orderStatus: String,
  total: Number,
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", OrderSchema);
