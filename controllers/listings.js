const Listing = require("../models/listing");
const geocode = require("../utils/geocode");

module.exports.index = async(req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings})
}

module.exports.renderNewForm = (req,res)=>{
    res.render("listings/new.ejs");
};

module.exports.showListings = async(req,res)=>{
    let {id}=req.params;
    const data = await Listing.findById(id).populate({path:"reviews", populate:{ path :"author"}}).populate("owner");
    if(!data){
        req.flash("error","Listing you requested for does not exist!");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs",{data});
};

module.exports.createListing = async (req,res,next)=>{
    // if valid listing is not sent
    // if(!req.body.listing){
    //     throw new ExpressError(400,"Send valid data for listing");
    // }
    let url = req.file.path;
    let filename = req.file.filename;
    console.log(url,"..",filename);

    //to save the coordinates
    const coordinates = await geocode(
        req.body.listing.location,
        req.body.listing.country
    );
    
    const newList = new Listing (req.body.listing);
    newList.owner = req.user._id;//  stores id of current user..
    newList.image = {url, filename};
    newList.coordinates = coordinates;
    await newList.save();
    req.flash("success","New Listing created!");
    res.redirect("/listings");
    
};

module.exports.getEditListing = async(req,res) =>{
    let {id}=req.params;
    const data = await Listing.findById(id);
    if(!data){
        req.flash("error","Listing you requested for does not exist!");
        return res.redirect("/listings");
    }
    let originalImageUrl = data.image.url;
    originalImageUrl = originalImageUrl.replace("/upload","/upload/w_250");
    res.render("listings/edit.ejs",{data,originalImageUrl})
};

module.exports.editListing = async (req,res)=>{
    let {id}=req.params;

    const { location, country } = req.body.listing;

    const list = await Listing.findById(id);

if (location !== list.location || country !== list.country) {
    req.body.listing.coordinates = await geocode(location, country);
}
    //tod ke saare feilds me updated value daal di
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});

    if(typeof req.file!=="undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url,filename};
        await listing.save();
    }
    
    req.flash("success","Listing updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async(req,res)=>{
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing deleted!");
    res.redirect("/listings");
};