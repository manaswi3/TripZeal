const express = require("express");

//to link the parameters of parent route to child route (written in app.js)
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError.js")
const { reviewSchema } = require("../schema_valid.js")
const Review  = require("../models/review.js");
const Listing = require("../models/listing.js");

const validateReview = (req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
        if(error){
            // to get exact message from details array
            let errMsg=error.details.map((el)=>el.message).join(",");
            throw new ExpressError(400,errMsg);
        }
        else{
            next();
        }
};

//Post Request
router.post("/",validateReview,wrapAsync(async(req,res)=>{
    let list = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    list.reviews.push(newReview._id);

    await newReview.save();
    await list.save();
    req.flash("success","New Review created!");
    res.redirect(`/listings/${list._id}`);
}));

//DELETE Review Route
router.delete("/:reviewId",wrapAsync(async(req,res)=>{
    let {id,reviewId} = req.params;

    await Listing.findByIdAndUpdate(id,{$pull: {reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);

    req.flash("success","Review deleted!");
    res.redirect(`/listings/${id}`);
}));

module.exports = router;