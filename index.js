import express from "express";
import path from "path";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";

mongoose.connect("mongodb://127.0.0.1:27017", {
    dbName: "sanket"
}).then(() => console.log("Database Connected"))
    .catch((e) => console.log(e));
const ComplaintSchema = new mongoose.Schema({
    name: String,
    email: String,
    establishment_type:String, who:String, country:String, establishment_name:String, number:String, message:String
});
const UserSchema = new mongoose.Schema({
    name: String,
    email: String
});
const User = mongoose.model("User", UserSchema);
const Complaints = mongoose.model("Complaints", ComplaintSchema);
const app = express();
const users = [];
app.use(express.static(path.join(path.resolve(), "public")));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.set("view engine", "ejs");
// Authentication middleware
const is_Authenticated = async (req, res, next) => {
    const { token } = req.cookies;
    if (token) {
        const decoded = jwt.verify(token, "setjdjdrshagwe");
        req.user = await User.findById(decoded._id)
        next();
    } else {
        res.redirect("/login"); // Redirect to the login page if not authenticated
    }
};
// Initial route, opens the login page
app.get("/", (req, res) => {
    res.redirect("/login");
});
// Login route, displays the login page
app.get("/login", (req, res) => {
    res.render("login"); // Assuming you have a "login.ejs" view
});
app.post("/login", async (req, res) => {
    const { email } = req.body;
    let user = await User.findOne({ email });
    if (!user) {
        // If the user is not found in the database, redirect to the register page
        res.redirect("/register");
        return;
    }
    // User found, proceed with authentication
    // ... (authentication logic)
    res.redirect("/landingPage"); // After successful login, redirect to the logout page
});
// Logout route, displays the logout page
app.get("/landingPage", (req, res) => {
    res.render("landingPage"); // Assuming you have a "logout.ejs" view
});
app.get("/page1", (req, res) => {
    res.render("page1"); // Assuming you have a "logout.ejs" view
});

app.get("/gallary", (req, res) => {
    res.render("gallary"); // Assuming you have a "logout.ejs" view
});

app.get("/viewmore", (req, res) => {
    res.render("viewmore"); // Assuming you have a "logout.ejs" view
});

app.get("/index2", (req, res) => {
    res.render("index2"); // Assuming you have a "logout.ejs" view
});

app.get("/logout", (req, res) => {
    res.render("logout"); // Assuming you have a "logout.ejs" view
});
app.get("/home", (req, res) => {
    res.render("home"); // Assuming you have a "logout.ejs" view
});
app.post("/home",async(req, res) =>{
    const { name, establishment_type, email, who, country, establishment_name, number, message } = req.body;
    let user = await Complaints.findOne({ email });
    if (user) {
        return res.status(400).json({ message: "Complaint already exists." });
    }
    user = await Complaints.create({//creating a new document 
        name, establishment_type, email, who, country, establishment_name, number, message
    });
    return res.status(200).json({ message: "Complaint submitted successfully." });
});
// ... (existing code)
app.get("/register", (req, res) => {
    res.render("register"); // Assuming you have a "register.ejs" view
});
app.post("/register", async (req, res) => {
    const { name, email } = req.body;
    let user = await User.findOne({ email });
    if (user) {
        return res.redirect("/login");
    }
    user = await User.create({
        name,
        email,
    });
    const token = jwt.sign({ _id: user._id }, "sjdtfwgwkec");
    res.cookie("token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + 60 * 1000)
    });
    // After successful registration, redirect back to the login page
    res.redirect("/login");
});
app.listen(5000, () => {
    console.log("Server is working");
});


