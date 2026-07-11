const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError.js")
const { listingSchema} = require("../schema_valid.js")
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");

const listingController = require("../controllers/listings.js")




//Index Route
router.get("/",wrapAsync(listingController.index));

//Create Route
router.get("/new", isLoggedIn, listingController.renderNewForm)

router.post("/", isLoggedIn, validateListing, wrapAsync(listingController.createListing))

//update Route
router.get("/:id/edit", isLoggedIn,isOwner, wrapAsync(listingController.getEditListing))

router.put("/:id", isLoggedIn,isOwner, validateListing, wrapAsync(listingController.editListing))

//Show Route
router.get("/:id",wrapAsync(listingController.showListings));

//Delete Route
router.delete("/:id", isLoggedIn,isOwner, wrapAsync(listingController.deleteListing));

module.exports = router;

