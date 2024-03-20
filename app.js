const express = require("express");
const axios = require("axios");
const ejs = require("ejs");
const path = require("path");
var cookieParser = require("cookie-parser");
const { db } = require("./routers/mongodb");
// const router = require("./routers/router");
const mvlist_router = require("./routers/movielist");
const homeRouter = require("./routers/homeRouter");
const credential_router = require("./routers/credential");
const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set("view engine", "html");
app.engine("html", ejs.renderFile);

app.use(express.static("public"));
app.use("/css", express.static(path.join(__dirname, "views", "css")));
app.use("/images", express.static(path.join(__dirname, "views", "images")));

app.get("/getLocation", async (req, res) => {
  try {
    const response = await axios.get("https://ipinfo.io/json");
    const { loc, city, country, postal } = response.data;
    const [latitude, longitude] = loc.split(",");
    res.json({ latitude, longitude, city, country, postal });
  } catch (error) {
    console.error("Error fetching user location:", error.message);
    res.status(500).json({ error: "Error fetching user location" });
  }
});

const PORT = process.env.PORT || 81;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.use(mvlist_router);
app.use(homeRouter);
app.use(credential_router);