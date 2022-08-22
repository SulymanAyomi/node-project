const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductTypeSchema = new Schema({
  type: { type: String, unique: true, required: true },
  slug: { type: String, unique: true, required: true },
});

ProductTypeSchema.virtual("getAbsoluteUrl").get(function () {
  return `products/${this.slug}/`;
});
module.exports = mongoose.model("ProductType", ProductTypeSchema);
