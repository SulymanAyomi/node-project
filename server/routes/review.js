const router = require("express").Router();
const verfityToken = require("../middlewares/verify-token");
const Review = require("../models/review");
const Product = require("../models/product");

router.post("/reviews/:productID", verfityToken, async (req, res) => {
  try {
    const review = new Review();
    review.headline = req.body.headline;
    review.body = req.body.body;
    review.rating = req.body.rating;
    review.user = req.decoded._id;
    review.productID = req.params.productID;
    // const product = Product.findOne({ id: req.params.productID });
    // await product.update({ $push: { reviews: review._id } });

    const savedReview = await review.save();

    if (savedReview) {
      res.json({
        success: true,
        message: "Successfully added a Review",
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

router.get("/review/:productID", async (req, res) => {
  try {
    const productReviews = await Review.find({
      productID: req.params.productID,
    })
      .populate("user")
      .exec();

    res.json({
      success: true,
      reviews: productReviews,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

module.exports = router;
