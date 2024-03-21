const express = require("express");
const fetch = require('node-fetch');
const { getJson } = require("serpapi");
var cookieParser = require("cookie-parser");
const axios = require("axios");
const options = {
  caseSensitive: true,
  strict: true,
};
const router = express.Router(options);
router.get('/movie_details/:id', async function(req, res, next){
  let movie_id = req.params.id;
  res.cookie("latestMovie", movie_id);
  //res.cookie("mids", req.cookies.mids['id'].push(movie_id))
  try{
  let movie = await axios.get(`https://api.themoviedb.org/3/movie/${movie_id}?language=en-US&api_key=${process.env.API_KEY}&page=1`);
  const now = await axios.get(`https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1&api_key=${process.env.API_KEY}&page=1`);
  let video = await axios.get(`https://api.themoviedb.org/3/movie/${movie_id}/videos?language=en-US&api_key=${process.env.API_KEY}&page=1`);
  
  if (movie.status != 200) {
    res.render("error: Failed to get Movie Details!!");
  }
  
  if (now.status != 200) {
    res.render("error: Failed to get Now Playings");
  }

  if (video.status != 200) {
    res.render("error: Failed to get trailer for movie id");
  }

  const recommendRes = await axios.get(`https://api.themoviedb.org/3/movie/${movie_id}/recommendations?language=en-US&api_key=${process.env.API_KEY}&page=1`);
  if (recommendRes.status != 200) {
    res.render("error: Failed to get recommendations for you!!");
  }
  
    let playimg = "https://image.tmdb.org/t/p/w500"+movie['data']['poster_path']
    let mainimg = "https://image.tmdb.org/t/p/w500"+movie['data']['backdrop_path']
    let title = movie['data']['title']
    let overview = movie['data']['overview']
    let vote_avg = movie['data']['vote_average']
    let vote_count = movie['data']['vote_count']
    let homepg = movie['data']['homepage']
    let lang = movie['data']['original_language']
    let status = movie['data']['status']
    let revenue = movie['data']['revenue']
    let budget = movie['data']['budget']
    let trailer = "https://www.youtube.com/embed/"+video['data']['results'][0]['key']
    
    let isNow = false
    for (let ele of now['data']['results']){
        if (ele['id'].toString() === movie_id.toString()){
        
          isNow = true
        }
    }
  console.log("Is Now playing", isNow, movie_id)

  res.render('pages/movie', {data: {t: title, o:overview,
                                    stat: status, rev :revenue,
                                    bud: budget, language: lang, 
                                    v1:vote_avg, v2:vote_count, 
                                    img:playimg, main:mainimg, 
                                    mid:movie_id, hg:homepg,isPlaying:isNow,
                                    trail:trailer, movies1: recommendRes.data.results }})}
 catch(error){
  console.error('Error fetching data from TMDB:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
 }
  })

module.exports = router; 