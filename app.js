const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const MongoDB_url = "mongodb://127.0.0.1:27017/tripzeal";
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js")

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js")

const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const sessionOptions = {
    secret:"mysupersecret",
    resave: false,
    saveUninitialized:true,
    cookie:{
        expires: Date.now() + 7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly: true,
    },
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(express.static(path.join(__dirname,"/public")))
app.engine('ejs',ejsMate);
app.use(express.urlencoded({extended:true}))
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(methodOverride("_method"));

app.use((req,res,next)=>{
    res.locals.currUser = req.user;
    res.locals.success=req.flash("success");
    res.locals.error = req.flash("error");
    next();
})

// app.get("/demouser",async (req,res)=>{
//     let fakeUser =new User({
//         email:"demo@gmail.com",
//         username: "student_demo",
//     });

//     let userDemo = await User.register(fakeUser,"helloworld");
//     res.send(userDemo);
// });

main().then(()=>{
    console.log("connect to DB");
}).catch(err=>console.log(err));

async function main(){
    await mongoose.connect(MongoDB_url);
}

app.get("/",(req,res)=>{
    res.send("Hey, I am root")
})

//All Listings Route----->>
app.use("/listings",listingRouter);


//All Reviews Route----->>
app.use("/listings/:id/reviews",reviewRouter);

//All user Route-------->>
app.use("/",userRouter);


//as per the newer version of express , (*)-->(a wildcard lib) is not valid now
app.use((req,res,next)=>{
    next(new ExpressError(404,"Page not found!"));
});

//Errr Handling Middleware
app.use((err,req,res,next)=>{
    let{status=500, message="Something went wrong"}=err;
    res.status(status).render("error.ejs",{message});
});

app.listen(8080,()=>{
    console.log("server is listening on port 8080..");
})

//One-time database cleanup command
app.get("/cleanup", async (req,res)=>{
    await Review.deleteMany({});
    await Listing.updateMany({}, { $set: { reviews: [] } });

    res.send("Database cleaned!");
});