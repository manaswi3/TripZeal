const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError.js")
const { listingSchema} = require("../schema_valid.js")
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");

const multer  = require('multer')
const {storage} = require('../cloudConfig.js');
const upload = multer({storage});

const listingController = require("../controllers/listings.js")

//Index Route
router
    .route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn,upload.single("listing[image]"), validateListing, wrapAsync(listingController.createListing))
    
//Create Route
router.get("/new", isLoggedIn, listingController.renderNewForm)

router
    .route("/:id")
    .put(isLoggedIn,isOwner,upload.single("listing[image]"), validateListing, wrapAsync(listingController.editListing))
    .get(wrapAsync(listingController.showListings))
    .delete(isLoggedIn,isOwner, wrapAsync(listingController.deleteListing))



//edit Route
router.get("/:id/edit", isLoggedIn,isOwner, wrapAsync(listingController.getEditListing))

module.exports = router;

