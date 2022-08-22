const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OwnerSchema = new Schema({
  storeName: String,
  about: String,
  photo: String,
  number: Number,
  user: { type: Schema.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("Owner", OwnerSchema);
