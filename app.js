const express = require("express");
const axios = require("axios");
const ejs = require("ejs");
const path = require("path");
var cookieParser = require('cookie-parser');
const app = express();
app.set("view engine", "html");
app.engine("html", ejs.renderFile);

// CUSTOM ROUTERS
const { db } = require("./routers/mongodb");
var {theatreRouter, getCurrentLocation} = require('./routers/theatres.js');
// const router = require("./routers/router");
const mvlist_router = require("./routers/movielist");
const homeRouter = require("./routers/homeRouter");
const movierouter = require("./routers/movieRouter");
const credential_router = require("./routers/credential");

// CONFIGURATION MIDDLEWARES
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.use(express.static("public"));
app.use("/css", express.static(path.join(__dirname, "views", "css")));
app.use("/images", express.static(path.join(__dirname, "views", "images")));
app.use("/js", express.static(path.join(__dirname, "views", "js")));

// ---------------------------------------------------------------------------------------------

// CUSTOM ROUTERS MIDDLEWARES
app.use(theatreRouter);

// RUN THE SERVER
const PORT = process.env.PORT || 80;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.use(mvlist_router);
app.use(homeRouter);
app.use(credential_router);
app.use(movierouter);


