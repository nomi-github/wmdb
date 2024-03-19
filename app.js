const express = require("express");
const axios = require("axios");
const ejs = require("ejs");
const path = require("path");
var cookieParser = require('cookie-parser');

const app = express();

app.set("view engine", "html");
app.engine("html", ejs.renderFile);

// CUSTOM ROUTERS
const { db } = require("./routers/mongodb");
var {theatreRouter, getCurrentLocation} = require('./routers/theatres.js');
// const router = require("./routers/router");
const mvlist_router = require("./routers/movielist");
const homeRouter = require("./routers/homeRouter");
const credential_router = require("./routers/credential");

// CONFIGURATION MIDDLEWARES
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.use(express.static("public"));
app.use("/css", express.static(path.join(__dirname, "views", "css")));
app.use("/images", express.static(path.join(__dirname, "views", "images")));
app.use("/js", express.static(path.join(__dirname, "views", "js")));

// ---------------------------------------------------------------------------------------------

// CUSTOM ROUTERS MIDDLEWARES
app.use(theatreRouter);

// RUN THE SERVER
const PORT = process.env.PORT || 80;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


app.get('/movie_details/:id/:location', async function(req, res, next){

  // get the movie details from request object 
  let movie_id = req.params.id;
  

  let ulocation = decodeURIComponent(req.params.location)
  console.log(typeof ulocation)
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
  let theaters = getJson({
    q: "Theaters near me",
    location: ulocation,
    engine: "google_local",
    hl: "en",
    gl: "us",
    api_key: "bd8997a5a5ad41c2f2f21767535dc7ac1d31fc5e6da73dc7397cc339af51c75b"
  }, (json) => {
    //console.log(json['local_results']);
    return json['local_results']
  });


  let video = fetch(videourl, options).then((res) => res.json())
   /*     .then(json => {
            key = json['results'][0]['key']
            trailer = "https://www.youtube.com/embed/"+key
        })*/

  Promise.all([movie, nowplays, theaters, video]).then(values => {
    let movie = values[0]
    let playimg = "https://image.tmdb.org/t/p/w500"+movie['poster_path']
    let mainimg = "https://image.tmdb.org/t/p/w500"+movie['backdrop_path']
    let title = movie['title']
    let overview = movie['overview']
    let vote_avg = movie['vote_average']
    let vote_count = movie['vote_count']
    let homepg = movie['homepage']
    /**
     * fetch on videourl does not give any results for Now Playing
     * 
     * 
     * 
     */
    
    //console.log("Video", values[3])
    let trailer = "https://www.youtube.com/embed/"+values[3]['results'][0]['key']
    console.log(trailer)
    //console.log('Now Playing', values[1]['results'])


    //console.log('Movies', values[0]['homepage'])
    //console.log('theaters', values[2]['local_results'])
    let isNow = false
    //console.log(values[1]['results'])

    for (let ele of values[1]['results']){

        if (ele['id'].toString() === movie_id.toString()){
          console.log("Movie is Playing")
          isNow = true
        }
      
    }

    /**
     * 
     * My google places search for theaters are 
     * title to know the name
     * address
     * thumbnail
     * description
     * ratings
     * 
    */

    console.log("This is isNow "+isNow)
    res.render('pages/movie', {data: {t: title, o:overview, v1:vote_avg, v2:vote_count, img:playimg, main:mainimg, mid:movie_id, hg:homepg, location:ulocation, isPlaying:isNow, trail:trailer, theaters: values[2]['local_results']}})
  })
  .catch(err => console.error('error:' + err));

})

app.use(mvlist_router);
app.use(homeRouter);
app.use(credential_router);