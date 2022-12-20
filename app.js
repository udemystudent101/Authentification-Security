//jshint esversion:6
require('dotenv').config();
const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const app = express();
 
// PUBLIC FOLDER FOR PUBLIC FILES
app.use(express.static("public"));


// SETUP EJS FOR TEMPLATING
app.set("view engine", "ejs");

// Use this to pass our request
app.use(express.urlencoded({extended: true}));

// CONNECT TO OUR DATABASE
mongoose.connect("mongodb+srv://admin:123456789-@cluster0.emr7fqc.mongodb.net/userDB" , {useNewUrlParser: true});

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

console.log(process.env.API_KEY);





const User = new mongoose.model("User", userSchema);





app.get("/", function(req,res){
    res.render("home");
});

app.get("/login", function(req,res){
    res.render("login");
});

app.get("/register", function(req,res){
    res.render("register");
});

app.post("/register", function(req, res){

    bcrypt.hash(req.body.password, saltRounds, function(err, hash){
        console.log(hash);
        console.log(req.body.password);
        const newUser = new User({
            email: req.body.username,
            password: hash
        });
        newUser.save(function(err){
            if (err) {
                console.log(err);
            } else {
                res.render("secrets");
            }
        });
    });
});

app.post("/login", function(req, res){
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email: username}, function(err, foundUser){
        if (err){

            console.log(err);

        } else {
            if (foundUser) {
                bcrypt.compare(password, foundUser.password, function(err, result){
                    console.log(result);
                    console.log(foundUser.password);
                    console.log(password);
                    if (result === true) {
                        res.render("secrets");
                    }
                });
            }
        }
    });
});

 
// INITIALISE SERVER ON PORT 3000
app.listen(3000, function() {
    console.log("Server started on port 3000.");
});