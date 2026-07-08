const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError.js")
const { listingSchema} = require("../schema_valid.js")
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner} = require("../middleware.js");


const validateListing = (req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
        console.log(error);
        if(error){
            // to get exact message from details array
            let errMsg=error.details.map((el)=>el.message).join(",");
            throw new ExpressError(400,errMsg);
        }
        else{
            next();
        }
};



//Index Route
router.get("/",wrapAsync(async(req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings})
}));

//Create Route
router.get("/new", isLoggedIn, (req,res)=>{
    res.render("listings/new.ejs");
})

router.post("/", isLoggedIn, validateListing, wrapAsync(async (req,res,next)=>{
    // if valid listing is not sent
    // if(!req.body.listing){
    //     throw new ExpressError(400,"Send valid data for listing");
    // }
    
    const newList = new Listing (req.body.listing);
    newList.owner = req.user._id;//  stores id of current user..
    await newList.save();
    req.flash("success","New Listing created!");
    res.redirect("/listings");
    
}))

//update Route
router.get("/:id/edit", isLoggedIn,isOwner, wrapAsync(async(req,res) =>{
    let {id}=req.params;
    const data = await Listing.findById(id);
    if(!data){
        req.flash("error","Listing you requested for does not exist!");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs",{data})
}))

router.put("/:id", isLoggedIn,isOwner, validateListing, wrapAsync(async (req,res)=>{
    let {id}=req.params;
    
    //tod ke saare feilds me updated value daal di
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success","Listing updated!");
    res.redirect(`/listings/${id}`);
}))

//Show Route
router.get("/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const data = await Listing.findById(id).populate("reviews").populate("owner");
    if(!data){
        req.flash("error","Listing you requested for does not exist!");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs",{data});
}));

//Delete Route
router.delete("/:id", isLoggedIn,isOwner, wrapAsync(async(req,res)=>{
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing deleted!");
    res.redirect("/listings");
}));

module.exports = router;

