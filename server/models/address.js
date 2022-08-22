const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AddresSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  state: String,
  lastName: String,
  firstName: String,
  streetAddress: String,
  city: String,
  zipCode: Number,
  phoneNumber: String,
  deliveryInstructions: String,
});

module.exports = mongoose.model("Address", AddresSchema);
