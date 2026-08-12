const mongoose = require("mongoose");
if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MongoDB_url = `${process.env.MONGO_URL}`;

main().then(()=>{
    console.log("connect to DB");
}).catch(err=>console.log(err));

async function main(){
    await mongoose.connect(MongoDB_url);
}

const initDB = async() =>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=> ({...obj,owner:'6a36d78c6f2e1fe3768d78e5',}));
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
};

initDB();