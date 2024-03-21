const { MongoClient } = require("mongodb");
const bcrypt = require("bcrypt");
const express = require("express");
const axios = require("axios");
const credentialRouter = express.Router();
var path = require("path");
const { db } = require("./mongodb");

credentialRouter.get("/signup", (req, res) => {
  res.render("pages/registerCustom", { msg: "" });
});

credentialRouter.post("/signup", async (req, res) => {
  console.log("post......");

  if (req.body.password.length < 9) {
    res.render("pages/registerCustom", { msg: "Password length must be between 6 to 30." });
  } else {
    const user = db.findUserByUsername(req.body.name);
    if(!user){
        const result = db.createUser(req.body.email, req.body.name, req.body.password);
        if ((await result).acknowledged) {
          res.cookie("username", req.body.name);

          res.cookie("latestMovie", "");
          // res.render("pages/loader");
          res.redirect('/');
        }
    }else{
        // res.render("pages/signup", { msg: 'User already existed.' });
        res.render("pages/registerCustom", { msg: 'User already existed.' });
    }
  }
});

credentialRouter.get("/signin", (req, res) => {
  // res.render('pages/signin', {msg:""});
  res.render("pages/loginCustom", { msg: "" });
});

credentialRouter.get("/signout", (req,res)=>{
    res.clearCookie('username');
    res.clearCookie('latestMovie');
    res.redirect('/');
});

credentialRouter.post("/signin", async (req, res) => {
  console.log("Sign In post.....");

  if(req.cookies.username === req.body.name){
    res.redirect('/');
  }else{
    try {
      // Verify user credentials
      const loginData = await db.verifyUserCredentials(req.body.name, req.body.password);
      if (loginData.loginResult) {
        // res.status(200).send('Login successful'); // get error
        const latestmovieId = loginData.latestMovie;
        if(latestmovieId){
          res.cookie("latestMovie", latestmovieId.movie);
        }else{
          res.cookie("latestMovie", "");
        }
        
        res.cookie("username", req.body.name);
  
        res.redirect('/');

      } else {
        res.render("pages/loginCustom", { msg: "Invalid username or password" });
      }
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).send("Internal server error");
    }
  }  
});

module.exports = credentialRouter;
