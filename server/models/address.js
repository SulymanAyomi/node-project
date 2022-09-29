const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AddresSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  state: String,
  streetAddress: String,
  city: String,
  phoneNumber: String,
});

module.exports = mongoose.model("Address", AddresSchema);
