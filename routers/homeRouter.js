const express = require("express");
const axios = require("axios");
const options = {
  caseSensitive: true,
  strict: true,
};
const homeRouter = express.Router(options);

homeRouter.get("/", async function (req, res, next) {
  // res.cookie("latestMovie", "157336");
  // res.render("pages/loader");
  const nowPlayingRes = await axios.get(`https://api.themoviedb.org/3/movie/now_playing?language=en-US&api_key=${process.env.API_KEY}&page=1`);
  if (nowPlayingRes.status != 200) {
    res.render("error");
  }
  const popularRes = await axios.get(`https://api.themoviedb.org/3/movie/popular?language=en-US&api_key=${process.env.API_KEY}&page=1`);
  if (popularRes.status != 200) {
    res.render("error");
  }

  let movie_id = req.cookies.latestMovie;
  let recommendRes = [];
  console.log("movie id", req.cookies);
  if (movie_id && !Number.isNaN(Number(movie_id))) {
    console.log("movie id2", movie_id);
    recommendRes = await axios.get(`https://api.themoviedb.org/3/movie/${movie_id}/recommendations?language=en-US&api_key=${process.env.API_KEY}&page=1`);
    if (recommendRes.status != 200) {
      res.render("error");
    }
  }

  const upcoming = await axios.get(`https://api.themoviedb.org/3/movie/upcoming?language=en-US&api_key=${process.env.API_KEY}&page=1`);
  if (upcoming.status != 200) {
    res.render("error");
  }

  const genreRes = await axios.get(`https://api.themoviedb.org/3/genre/movie/list?api_key=${process.env.API_KEY}`);
  if (genreRes.status != 200) {
    res.render("error");
  }
  await res.render("pages/index", {
    popular: popularRes.data.results,
    nowPlaying: nowPlayingRes.data.results || [],
    recommend: recommendRes?.data?.results || [],
    upcoming: upcoming.data.results,
    isLogged: req.cookies.isLogged,
    genres: genreRes.data.genres,
  });
});

homeRouter.get("/search", async function (req, res, next) {
  let name = req.query.name;
  name.replaceAll(" ", "+");
  const searchRes = await axios.get(`https://api.themoviedb.org/3/search/movie?query=${name.replaceAll(" ", "+")}&adult=false&api_key=${process.env.API_KEY}&page=1`);
  if (searchRes.status != 200) {
    res.render("error");
  }
  // res.send(searchRes.data.results);
  await res.render("pages/search", { results: searchRes.data.results, name: req.query.name });
});

homeRouter.get("/login", function (req, res) {
  res.render("pages/loginCustom");
});
homeRouter.get("/register", function (req, res) {
  res.render("pages/registerCustom");
});

module.exports = homeRouter;
