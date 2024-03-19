const express = require('express');
const axios = require("axios");
const theatreRouter = express.Router();
var path = require('path');
const { count } = require('console');

theatreRouter.get("/theatres", function (req, res, next) {
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
theatreRouter.get("/getShowTimes", function (req, res, next) {
   // let result = getNearByShowTimes(req.cookies.location);
    getJson({
        q: "theaters nearby",
        location: req.cookies.location,
        hl: "en",
        gl: "us",
        api_key: serpApiKey
    }, (theatres) => {
        try {
            let localTheatres = theatres["showtimes"];//theatres["local_results"];
            res.send(localTheatres);
          /*  let result = [];
            for (let ele of localTheatres.places) {
                let obj = { title: ele.title, addr: ele.address, thumbnail: ele.thumbnail };
                getJson({ q: "movies at " + ele.title, api_key: serpApiKey }, (showTimes) => {
                    obj.showTimes = showTimes.showtimes;
                    console.log(obj.showTimes);
                    result.push(obj); // Push inside the callback to ensure it's executed after showTimes is assigned
                    if (result.length === localTheatres.places.length) {
                        res.send(result);
                        //resolve(result); // Resolve after all showTimes are assigned
                    }
                });                            
            }*/
           
        } catch (error) {
            reject(error);
        }
    });
})

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