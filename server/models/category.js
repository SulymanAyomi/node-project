const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
  slug: { type: String, unique: true, required: true },
  type: { type: String, unique: true, required: true },
});

CategorySchema.virtual("getAbsoluteUrl").get(function () {
  return `products/category/${this.slug}/`;
});
module.exports = mongoose.model("Category", CategorySchema);
