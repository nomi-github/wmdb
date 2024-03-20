const express = require("express");
const homeHelper = require("./homeHelper");
const axios = require("axios");
const options = {
  caseSensitive: true,
  strict: true,
};
const homeRouter = express.Router(options);

homeRouter.get("/", async function (req, res, next) {
  res.cookie("latestMovie", "157336");
  // res.render("pages/loader");
  const nowPlayingRes = await axios.get(`https://api.themoviedb.org/3/movie/now_playing?language=en-US&api_key=${process.env.API_KEY}&page=1`);
  if (nowPlayingRes.status != 200) {
    res.render("error");
  }
  const popularRes = await axios.get(`https://api.themoviedb.org/3/movie/popular?language=en-US&api_key=${process.env.API_KEY}&page=1`);
  if (popularRes.status != 200) {
    res.render("error");
  }

  let movie_id = req.cookies.latestMovie || 157336;
  console.log("movie id", movie_id);
  const recommendRes = await axios.get(`https://api.themoviedb.org/3/movie/${movie_id}/recommendations?language=en-US&api_key=${process.env.API_KEY}&page=1`);
  if (recommendRes.status != 200) {
    res.render("error");
  }
  console.log("rec", recommendRes.data.results);
  const upcoming = await axios.get(`https://api.themoviedb.org/3/movie/upcoming?language=en-US&api_key=${process.env.API_KEY}&page=1`);
  if (upcoming.status != 200) {
    res.render("error");
  }

  const genreRes = await axios.get(`https://api.themoviedb.org/3/genre/movie/list?api_key=${process.env.API_KEY}`);
  if (genreRes.status != 200) {
    res.render("error");
  }
  console.log(req.cookies.isLogged);
  await res.render("pages/index", {
    popular: popularRes.data.results,
    nowPlaying: nowPlayingRes.data.results,
    recommend: recommendRes.data.results,
    isLogged: req.cookies.isLogged,
    genres: genreRes.data.genres,
  });

  // response.nowPlaying = await homeHelper.nowPlaying(1);
  // response.genres = await homeHelper.genres();
  // response.recommend = await homeHelper.recommend(1);
  // await console.log(response);
  // await res.render("pages/index", { data: response });
});

module.exports = homeRouter;
