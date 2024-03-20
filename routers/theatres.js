const express = require('express');
const axios = require("axios");
const theatreRouter = express.Router();
var path = require('path');
const { count } = require('console');
const { db } = require("./mongodb");

theatreRouter.get("/theaters", function (req, res, next) {
    let dates = getDateList();
    let today = new Date();
    if (!req.cookies.location) {
        console.log('getting the location');
        getCurrentLocation().then(location => {
            console.log("location: " + location);
            res.cookie("location", location);
            res.render("pages/theatre_list", { dates: dates, location: location });
        })
    } else {
        console.log("location: " + req.cookies.location);
        res.render("pages/theatre_list", { dates: dates, location: req.cookies.location });
    }
})

theatreRouter.post("/changeLocation", function (req, res, next) {
    let newLocation = req.body.newLocation;
    console.log("post theatres", newLocation);
    res.cookie("location", newLocation);
    res.redirect("back");
})

let serpApiKey = "e6ae8922bede93a3c646ceefd0231588ffecdb8a8d556f3b063a100b8b4c8a91";
const { getJson } = require("serpapi");
const { json } = require('body-parser');

theatreRouter.get("/getShowTimes", async function (req, res, next) {
    // let result = getNearByShowTimes(req.cookies.location);
    let theatres = await getJson({
        q: "theaters nearby",
        location: req.cookies.location,
        hl: "en",
        gl: "us",
        api_key: serpApiKey
    });

    let localTheatres = theatres["local_results"];
    let result = [];
    for (let ele of localTheatres.places) {
        let obj = { title: ele.title, addr: ele.address, thumbnail: ele.thumbnail };
        let showTimes = await getJson({ q: "movies at " + ele.title, api_key: serpApiKey });
        obj.showTimes = showTimes.showtimes;
        console.log(obj.showTimes);
        result.push(obj); // Push inside the callback to ensure it's executed after showTimes is assigned
    }
    res.send(result);
})


// const { db } = require("./mongodb");
// theatreRouter.get('/latestMovie', async (req, res) => {
//     const username = 'john_doe';
//     const movieId = '654321';

//     try {
//         const result = await db.addMovieToUser(username, movieId);
//         res.status(200).json({ success: true, message: 'Latest movie saved/updated successfully' });

//     } catch (error) {
//         console.error('Error saving/updating latest movie:', error);
//         res.status(500).json({ success: false, message: 'Internal server error' });
//     }
// });

function getDateList() {
    const datesArray = [];
    for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(date.getDate() + i);
        let dateInfo = getDateInfo(date);
        if (i == 0) dateInfo.dayOfWeek = 'TODAY';
        datesArray.push(dateInfo);
    }
    return datesArray;
}

const dayAbbreviations = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function getDateInfo(date) {
    // Define options for the desired formats
    const options = { weekday: 'long', month: 'long' };
    const formattedDate = date.toLocaleString('en-US', options);
    let dayOfMonth = date.getDate();

    // Construct a new object with the extracted attributes
    return dateInfo = {
        dayOfMonth: (dayOfMonth < 10) ? '0' + dayOfMonth : dayOfMonth,
        dayOfWeek: dayAbbreviations[date.getDay()],
        month: formattedDate.split(' ')[0]
    };
}


function getCurrentLocation() {
    return axios.get('https://ipinfo.io/json')
        .then(response => {
            const { loc, city, country, postal, region } = response.data;
            // const [latitude, longitude] = loc.split(',');
            result = city + ", " + region + ", " + (country == 'US' ? 'United States' : country);
            console.log("//getCurrentLocation", result);
            return result;
        })
        .catch(error => {
            console.error('Error fetching current location:', error);
            return '';
        });
}

module.exports = { theatreRouter, getCurrentLocation };