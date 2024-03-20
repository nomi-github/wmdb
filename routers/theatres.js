const express = require('express');
const axios = require("axios");
const theatreRouter = express.Router();
var path = require('path');
const { count } = require('console');
const { db } = require("./mongodb");
require('dotenv').config();

theatreRouter.get("/theaters", async function (req, res, next) {
    let dates = getDateList();
    let today = new Date();
    let location = req.cookies.location;

    if (!location) {
        location = await getCurrentLocation();
        console.log('getting the location', location);
        res.cookie("location", location);
    }
    let localTheatres = req.cookies.localTheatres;
    console.log('cookies', req.cookies.localTheatres);
    if (!localTheatres) {
        let result = await callSerpApi("theaters nearby", location, "local_results");
        //console.log('serpApiresult', result);
        localTheatres = result.places;
        console.log('localTheatres', localTheatres);
    }

    res.cookie("localTheaterNames", getTheaterNames(localTheatres));
    res.cookie("localTheatres", localTheatres);
    res.render("pages/theatre_list", { dates: dates, location: location, localTheatres: localTheatres });
})

function getTheaterNames(places) {
    let result = [];
    if (Array.isArray(places) && places) {
        for (let p of places) {
            result.push(p.title);
        }
    }
    return result;
}

theatreRouter.post("/changeLocation", function (req, res, next) {
    let newLocation = req.body.newLocation;
    console.log("post theatres", newLocation);
    res.cookie("location", newLocation);
    res.clearCookie('localTheatres', { path: '/' });
    res.clearCookie('localTheaterNames', { path: '/' });
    res.redirect("back");
})

let serpApiKey = "e6ae8922bede93a3c646ceefd0231588ffecdb8a8d556f3b063a100b8b4c8a91";
const { getJson } = require("serpapi");
const { json } = require('body-parser');

theatreRouter.get("/getShowTimes/:selectedTheaterName", async function (req, res, next) {
    let selectedTheaterName = req.params.selectedTheaterName;
    console.log('selectedTheaterNames', selectedTheaterName);
    let result = [];
    let localTheaterNames = selectedTheaterName == "all" ? req.cookies.localTheaterNames : [selectedTheaterName];

    for (let name of localTheaterNames) {
        let obj = { theaterName: name };
        let showTimes = await getJson({ q: "movies at " + name, api_key: serpApiKey });
        //console.log(showTimes.showtimes);
        obj.showTimes = showTimes.showtimes;
        let movieNamesSet = new Set();
        if (obj.showTimes) {
            console.log('movies first iteration', obj.showTimes);
            iterateOverMovies(obj, function (movie) {
                movieNamesSet.add(movie.name);
            });
            console.log('movieNames', movieNamesSet);
            const movieMap = await db.getMovieDetailsByName(Array.from(movieNamesSet));
            console.log("movieMap", movieMap)
            iterateOverMovies(obj, function (movie) {
                 movie.movieDetail = movieMap[movie.name];
            });
        }
        result.push(obj);
    }
    console.log(result);
    res.send(result);
})

function iterateOverMovies(obj, callback) {
    console.log("iterateOverMovies", obj.showTimes);
    for (let date of obj.showTimes) {
        if (date.movies) {
            for (movie of date.movies) {
                if (movie.name) {
                    callback(movie);
                }
            }
        }
    }
}



async function callSerpApi(query, location, resultKey) {
    let theatres = await getJson({
        q: "theaters nearby",
        location: location,
        hl: "en",
        gl: "us",
        api_key: serpApiKey
    });

    return theatres[resultKey];
}

// async function getMovieDetail(movieName) {
//     try {
//         const formattedMovieName = movieName.replace(/\s+/g, '+'); // Replace spaces with '+'
//         console.log('formatted movieName', formattedMovieName);
//         const response = await axios.get(`https://api.themoviedb.org/3/search/movie?include_adult=false&page=1&language=en-US&api_key=${process.env.API_KEY}&query=${formattedMovieName}`);
//         //console.log('search result: ' + response);
//         return response.results[0];
//     } catch (error) {
//         //console.error('Error fetching movie details:', error);
//         throw error;
//     }
// }



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
        month: (formattedDate.split(' ')[0]).substring(0, 3)
    };
}


async function getCurrentLocation() {
    let response = await axios.get('https://ipinfo.io/json');
    const { loc, city, country, postal, region } = response.data;
    // const [latitude, longitude] = loc.split(',');
    let result = city + ", " + region + ", " + (country == 'US' ? 'United States' : country);
    console.log("//getCurrentLocation", result);
    return result;
}

module.exports = { theatreRouter, getCurrentLocation };