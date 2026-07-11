const Review = require("../models/review");
const Listing = require("../models/listing");

module.exports.createReview = async(req,res)=>{
    let list = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author=req.user._id;
    list.reviews.push(newReview._id);

    await newReview.save();
    await list.save();
    req.flash("success","New Review created!");
    res.redirect(`/listings/${list._id}`);
};

module.exports.deleteReview = async(req,res)=>{
    let {id,reviewId} = req.params;

    await Listing.findByIdAndUpdate(id,{$pull: {reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);

    req.flash("success","Review deleted!");
    res.redirect(`/listings/${id}`);
};