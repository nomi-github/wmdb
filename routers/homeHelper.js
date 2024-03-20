const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();
const fetch = require("node-fetch");
const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: "Bearer " + process.env.API_KEY,
  },
};

function nowPlaying(page) {
  url = "https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=" + page;
  fetch(url, options)
    .then((res) => res.json())
    .then((json) => {
      console.log("now", json);
      return json.results;
    })
    .catch((err) => {
      console.error("error:" + err);
      return err;
    });
}
async function popular(page) {
  url = "https://api.themoviedb.org/3/movie/popular?language=en-US&page=1";
  const popularRes = await axios.get(`https://api.themoviedb.org/3/movie/popular?language=en-US&api_key=${process.env.API_KEY}&page=1`);
  if (popularRes.status == 200) {
    return popularRes.data.results;
  } else return [];
}

function recommend(movie_id) {
  movie_id = 157336;
  url = `https://api.themoviedb.org/3/movie/157336/recommendations?language=en-US&page=1`;
  fetch(url, options)
    .then((res) => res.json())
    .then((json) => {
      console.log("recom", json);
      return json.results || {};
    })
    .catch((err) => {
      console.error("error:" + err);
      return err;
    });
}

function genres() {
  url = "https://api.themoviedb.org/3/genre/movie/list?language=en";
  fetch(url, options)
    .then((res) => res.json())
    .then((json) => {
      console.log("genres", json);
      return json.results;
    })
    .catch((err) => {
      console.error("error:" + err);
      return err;
    });
}

function search() {}
const homeHelper = { nowPlaying: nowPlaying, popular: popular, recommend: recommend, genres: genres };
module.exports = homeHelper;
