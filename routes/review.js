const express = require("express");

//to link the parameters of parent route to child route (written in app.js)
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError.js")
const { reviewSchema } = require("../schema_valid.js")
const Review  = require("../models/review.js");
const Listing = require("../models/listing.js");
const {validateReview, isOwner, isLoggedIn, isReviewAuthor} = require("../middleware.js")

const reviewController = require("../controllers/reviews.js");

//Post Request
router.post("/",validateReview, isLoggedIn, wrapAsync(reviewController.createReview));

//DELETE Review Route
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.deleteReview));

module.exports = router;