const mongoose = require("mongoose");
const mongooseAlgolia = require("mongoose-algolia");
const Schema = mongoose.Schema;

const ProductSchema = new Schema(
  {
    title: String,
    description: String,
    photo: String,
    material: String,
    stockQuantity: Number,
    SKU: String,
    weight: String,
    slug: { type: String, unique: true, required: true },
    category: { type: Schema.Types.ObjectId, ref: "Category" },
    reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
    color: [],
    brand: { type: Schema.Types.ObjectId, ref: "Brand" },
    tags: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
    productType: { type: Schema.Types.ObjectId, ref: "ProductType" },
    price: {
      XS: Number,
      S: Number,
      M: Number,
      L: Number,
      XL: Number,
    },
    inStock: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true, toObject: { virtuals: true }, toJSON: { virtuals: true } }
);

ProductSchema.virtual("avarageRating").get(function () {
  if (this.reviews.length > 0) {
    let sum = this.reviews.reduce((total, review) => {
      return total + review.rating;
    }, 0);

    return sum / this.reviews.length;
  }

  return 0;
});

ProductSchema.virtual("getAbsoluteUrl").get(function () {
  return `/products/${this.slug}/`;
});

ProductSchema.plugin(mongooseAlgolia, {
  appId: process.env.ALGOLIA_APP_ID,
  apiKey: process.env.ALGOLIA_SECRET,
  indexName: process.env.ALGOLIA_INDEX,

  selector:
    "title _id photo description price rating avarageRating getAbsoluteUrl",
  // populate: {
  //   path: "owner",
  //   select: "name",
  // },
  debug: true,
});

let Model = mongoose.model("Product", ProductSchema);

Model.SyncToAlgolia();

Model.SetAlgoliaSettings({
  searchableAttributes: ["title"],
});

module.exports = Model;
