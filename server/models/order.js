const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    customer: String,
    products: [
      {
        productID: { type: Schema.Types.ObjectId, ref: "Product" },
        quantity: Number,
        price: Number,
        size: String,
      },
    ],
    estimateDelivery: Date,
    status: { type: String, enum: ["New", "Paid", "Cancle", "Done"] },
    total: Number,
    receiver: { type: Schema.Types.ObjectId, ref: "User" },
    updateby: { type: Schema.Types.ObjectId, ref: "User" },
    payment: {
      type: String,
      enum: ["Online payment", "Cash on delivery", "Store sale"],
    },
    quantityBought: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
