const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const MONGO_URL = "mongodb://127.0.0.1:27017/projectwt";

main()
.then(() => {
    console.log("connected to DB");
})
.catch((err) => {
    console.log(err);
})
 
async function main() {
    await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

// app.get("/", (req, res) =>{
//     res.send("Hi, I am root");
// });

//index route 
app.get("/listings", async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
});

//New Route
app.get("/listings/new", (req, res) =>{
    res.render("listings/new.ejs");
});

//show route
app.get("/listings/:id", async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", { listing });
});

//create Route
app.post("/listings", async (req, res) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
});

//Edit route
app.get("/listings/:id/edit", async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});
});

//Update route
app.put("/listings/:id", async(req,res) =>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${id}`);
});

//delete route
app.delete("/listings/:id", async (req,res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
});

// Route to serve the login form (home page)
app.get("/", (req, res) => {
    res.render("login.ejs");  // Make sure this points to the correct view
});

// Route to handle login submission
app.post("/login", (req, res) => {
    const { username, password } = req.body;
    
    // Simple mock login check (for demonstration purposes)
    if(username === "admin" && password === "password") {
        return res.redirect("/listings");
    } else {
        return res.send("Invalid username or password");
    }
});


// app.get("/testListing", async (req, res) => {
//     let sampleListing = new Listing({
//         title: "My new Villa",
//         description: "By th beach",
//         price: 1200,
//         location: "Goa",
//         country: "India",
//     }); 

//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("Succesful testing");
// });

app.listen(8080, () => {
    console.log("Server is running on port 8080");
});