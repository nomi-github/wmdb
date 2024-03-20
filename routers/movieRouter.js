const express = require("express");
const fetch = require('node-fetch');
const { getJson } = require("serpapi");
var cookieParser = require("cookie-parser");
const axios = require("axios");
const homeHelper = require("./homeHelper");
const options = {
  caseSensitive: true,
  strict: true,
};
const router = express.Router(options);


router.get('/movie_details/:id', async function(req, res, next){
  let movie_id = req.params.id;
  //let movie_id = 636706; this is in theaters
  //let movie_id = 19995; this is not in theaters
  let movieurl = 'https://api.themoviedb.org/3/movie/'+movie_id+'?language=en-US';
  const now_playing = 'https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1';
  let videourl = 'https://api.themoviedb.org/3/movie/'+movie_id+'/videos?language=en-US';
  
  const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzN2MzNTc5ODE0Y2FmZGNjMWI4MjEyZmZjMzQ5OTNmZiIsInN1YiI6IjY1ZjVmNWY5ZDhmNDRlMDE2MzRlZWQ1NyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.xqxXb1-nAaRKKayR2IQSOAkjn7_21BosjYG9cUHMhYE'
    }
    };

  let prom1 = fetch(movieurl, options)
  let movie = prom1.then(res => res.json())
  let nowplays = fetch(now_playing,options).then(res => res.json())
  let video = fetch(videourl, options).then((res) => res.json())
  
  const recommendRes = await axios.get(`https://api.themoviedb.org/3/movie/${movie_id}/recommendations?language=en-US&api_key=${process.env.API_KEY}&page=1`);
  if (recommendRes.status != 200) {
    res.render("error");
  }
  console.log("rec", recommendRes.data.results[0]);
  
  Promise.all([movie, nowplays, video]).then(values => {
    let movie = values[0]
    let playimg = "https://image.tmdb.org/t/p/w500"+movie['poster_path']
    let mainimg = "https://image.tmdb.org/t/p/w500"+movie['backdrop_path']
    let title = movie['title']
    let overview = movie['overview']
    let vote_avg = movie['vote_average']
    let vote_count = movie['vote_count']
    let homepg = movie['homepage']
    let trailer = "https://www.youtube.com/embed/"+values[2]['results'][0]['key']
    //console.log(trailer)
    let isNow = false
    for (let ele of values[1]['results']){
        if (ele['id'].toString() === movie_id.toString()){
          console.log("Movie is Playing")
          isNow = true
        }
      
    }

  res.render('pages/movie', {data: {t: title, o:overview, 
                                    v1:vote_avg, v2:vote_count, 
                                    img:playimg, main:mainimg, 
                                    mid:movie_id, hg:homepg,isPlaying:isNow,
                                    trail:trailer, movies1: recommendRes.data.results }})
  })
  .catch(err => console.error('error:' + err));

})
module.exports = router; 