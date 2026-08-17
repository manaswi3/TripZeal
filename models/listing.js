const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");

const listingSchema = new Schema({
    title:{
        type: String,
        required: true,
    },
    description: String,
    image: {
        // type:String,
        // default:"https://images.unsplash.com/photo-1603262110263-fb0112e7cc33?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8amFpcHVyfGVufDB8fDB8fHww",
        filename: String,
        url: String,
        // set:(v)=> v===""?"https://images.unsplash.com/photo-1603262110263-fb0112e7cc33?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8amFpcHVyfGVufDB8fDB8fHww":v,
    },
    price: Number,
    location: String,
    country:String,
    // reviews for each listing
    reviews : [
        {
            type: Schema.Types.ObjectId,
            ref:"Review"
        }
    ],

    owner : {
            type: Schema.Types.ObjectId,
            ref:"User"
    },
    coordinates: {
        type: [Number],
        required:true
    },
    category:{
        type:[String],
        enum:{
            values: ["trending", "rooms", "iconic_cities", "mountains", "castles", "beaches", "arctic", "pools", "tropical", "ski", "camping", "villas", "countryside", "domes", "houseboat", "caves"],
        }
    }
});

//Middleware for the case
//------If a listing got deleted then all reviews must be deletd from the db-------
listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany(
            {_id : { $in: listing.reviews }}
        );
    }
});

const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;