const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const MongoDB_url = "mongodb://127.0.0.1:27017/tripzeal";
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
app.use(express.static(path.join(__dirname,"/public")))


app.engine('ejs',ejsMate);
app.use(express.urlencoded({extended:true}))
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(methodOverride("_method"));

main().then(()=>{
    console.log("connect to DB");
}).catch(err=>console.log(err));

async function main(){
    await mongoose.connect(MongoDB_url);
}

app.get("/",(req,res)=>{
    res.send("Hey, I am root")
})

//Index Route
app.get("/listings",async(req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings})
})

//Create Route
app.get("/listing/new",(req,res)=>{
    res.render("listings/new.ejs");
})

app.post("/listings",async (req,res)=>{
    const newList = new Listing (req.body.listing);
    await newList.save();
    res.redirect("/listings");
})

//update Route
app.get("/listing/:id/edit",async(req,res) =>{
    let {id}=req.params;
    const data = await Listing.findById(id);
    res.render("listings/edit.ejs",{data})
})

app.put("/listing/:id",async (req,res)=>{
    let {id}=req.params;
    //tod ke saare feilds me updated value daal di
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listing/${id}`);
})

//Show Route
app.get("/listing/:id",async(req,res)=>{
    let {id}=req.params;
    const data = await Listing.findById(id);
    res.render("listings/show.ejs",{data})
})

//Delete Route
app.delete("/listing/:id",async(req,res)=>{
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
})



// app.get("/testListing",async(req,res)=>{
//     let sample= new Listing({
//         title:"My New Villa",
//         description:"By the beach",
//         price:1200,
//         location:"Calangute, Goa",
//         country:"India",
//     });

//     await sample.save();
//     console.log("sample was saved");
//     res.send("Successfullllll");
// })

app.listen(8080,()=>{
    console.log("server is listening on port 8080..");
})