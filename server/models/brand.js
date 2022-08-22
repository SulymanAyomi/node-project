const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BrandSchema = new Schema({
  slug: { type: String, unique: true, required: true },
  type: { type: String, unique: true, required: true },
});

BrandSchema.virtual("getAbsoluteUrl").get(function () {
  return `products/${this.slug}/`;
});
module.exports = mongoose.model("Brand", BrandSchema);
