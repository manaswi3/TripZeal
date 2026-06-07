const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError.js")
const { listingSchema} = require("../schema_valid.js")
const Listing = require("../models/listing.js");


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
router.get("/new",(req,res)=>{
    res.render("listings/new.ejs");
})

router.post("/",validateListing, wrapAsync(async (req,res,next)=>{
    // if valid listing is not sent
    // if(!req.body.listing){
    //     throw new ExpressError(400,"Send valid data for listing");
    // }
    
    const newList = new Listing (req.body.listing);
    await newList.save();
    res.redirect("/listings");
    
}))

//update Route
router.get("/:id/edit",wrapAsync(async(req,res) =>{
    let {id}=req.params;
    const data = await Listing.findById(id);
    res.render("listings/edit.ejs",{data})
}))

router.put("/:id",validateListing, wrapAsync(async (req,res)=>{
    let {id}=req.params;
    //tod ke saare feilds me updated value daal di
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listing/${id}`);
}))

//Show Route
router.get("/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const data = await Listing.findById(id).populate("reviews");
    console.log(data.reviews);
    res.render("listings/show.ejs",{data});
}))

//Delete Route
router.delete("/:id",wrapAsync(async(req,res)=>{
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
}));

module.exports = router;

