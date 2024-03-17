const express = require("express");
const axios = require("axios");
const ejs = require("ejs");
const path = require("path");

const app = express();

app.set("view engine", "html");
app.engine("html", ejs.renderFile);

app.get("/", async (req, res) => {
  // Capture the user's IP address
  // const ipAddress = req.ip;
  const ipAddress = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  try {
    // Make a request to the IP-API to get geolocation information
    const response = await axios.get(`http://ip-api.com/json/${ipAddress}`);

    console.log("ip adress", ipAddress);

    // Extract relevant information from the response
    const { country, regionName, city, lat, lon } = response.data;

    // Handle the location data as needed (e.g., send it as a response)
    // res.json({ country, regionName, city, latitude: lat, longitude: lon });
    res.render("index");
  } catch (error) {
    console.error("Error fetching geolocation:", error);
    res.status(500).json({ error: "Error fetching geolocation" });
  }
});

app.use(express.static("public"));
app.use("/css", express.static(path.join(__dirname, "views", "css")));
app.use("/images", express.static(path.join(__dirname, "views", "images")));

const PORT = process.env.PORT || 80;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
