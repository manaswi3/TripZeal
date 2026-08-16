if(process.env.NODE_ENV != "production"){
    const res=require('dotenv').config({ path: "../.env" });
    console.log(res);
}
const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MongoDB_url = process.env.MONGO_URL;



async function main(){
    await mongoose.connect(MongoDB_url);
    console.log("connect to DB");
}

const initDB = async() =>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=> ({...obj,owner:'6a36d78c6f2e1fe3768d78e5',}));
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
};

main().then(initDB).catch(err=>console.log(err));