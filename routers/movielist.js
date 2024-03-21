const express = require("express");
const axios = require("axios");
const options = {
  caseSensitive: true,
  strict: true,
};
const mvlist_router = express.Router(options);

mvlist_router.get('/movies', async (req, res) => {
    try {
      const response_gen = await axios.get(`https://api.themoviedb.org/3/genre/movie/list?api_key=${process.env.API_KEY}`);
      const geners = response_gen.data.genres;
  
      const response_mov = await axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=${process.env.API_KEY}`);
      const response_mov2 = await axios.get(`https://api.themoviedb.org/3/discover/movie?page=2&api_key=${process.env.API_KEY}`);
      const response_mov3 = await axios.get(`https://api.themoviedb.org/3/discover/movie?page=3&api_key=${process.env.API_KEY}`);
      const response_mov4 = await axios.get(`https://api.themoviedb.org/3/discover/movie?page=4&api_key=${process.env.API_KEY}`);
      const response_mov5 = await axios.get(`https://api.themoviedb.org/3/discover/movie?page=5&api_key=${process.env.API_KEY}`);
          
      const mov1 = response_mov.data.results;
      const mov2 = response_mov2.data.results;
      const mov3 = response_mov3.data.results;
      const mov4 = response_mov4.data.results;
      const mov5 = response_mov5.data.results;
  
      // const all_movies = [...mov1, ...mov2, ...mov3, ...mov4, ...mov5];
  
      // // res.cookie("cok_movies", all_movies);
      // res.cookie("cok_movies", JSON.stringify(all_movies), { httpOnly: true });
      res.render('pages/movie_list', { 
        movies1: mov1, 
        movies2: mov2, 
        movies3: mov3, 
        movies4: mov4, 
        movies5: mov5, 
        geners:geners, 
        action: "all",
        msg: "All Movies"
      });
    } catch (error) {
      console.error(error);
      res.send('An error occurred');
    }
  });
  
  mvlist_router.post('/movielist', async (req, res) => {
    try {
      const response_gen = await axios.get(`https://api.themoviedb.org/3/genre/movie/list?api_key=${process.env.API_KEY}`);
      const geners = response_gen.data.genres;
  
      let name = "";
      if(req.body.hid_genID > 0){
        gen = geners.find(gen => gen.id === parseInt(req.body.hid_genID));
        name = " -> " + gen.name;
      }
      
  
      // console.log(gen.name);
  
      if(req.body.hid_menu === 'all'){
        const response_mov = await axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=${process.env.API_KEY}`);
        const response_mov2 = await axios.get(`https://api.themoviedb.org/3/discover/movie?page=2&api_key=${process.env.API_KEY}`);
        const response_mov3 = await axios.get(`https://api.themoviedb.org/3/discover/movie?page=3&api_key=${process.env.API_KEY}`);
        const response_mov4 = await axios.get(`https://api.themoviedb.org/3/discover/movie?page=4&api_key=${process.env.API_KEY}`);
        const response_mov5 = await axios.get(`https://api.themoviedb.org/3/discover/movie?page=5&api_key=${process.env.API_KEY}`);
        const response_mov6 = await axios.get(`https://api.themoviedb.org/3/discover/movie?page=6&api_key=${process.env.API_KEY}`);
        const response_mov7 = await axios.get(`https://api.themoviedb.org/3/discover/movie?page=7&api_key=${process.env.API_KEY}`);
            
        const mov1 = response_mov.data.results;
        const mov2 = response_mov2.data.results;
        const mov3 = response_mov3.data.results;
        const mov4 = response_mov4.data.results;
        const mov5 = response_mov5.data.results;
        const mov6 = response_mov6.data.results;
        const mov7 = response_mov7.data.results;
  
        var all_movies = [...mov1, ...mov2, ...mov3, ...mov4, ...mov5, ...mov6, ...mov7];
        if(req.body.hid_genID > 0){
            // console.log("Genre ID not 0", req.body.hid_genID, req.cookies.cok_movies);
            // var all_movies = [...now_ply_mov, ...now_ply_mov2, ...now_ply_mov3, ...now_ply_mov4, ...now_ply_mov5];
            all_movies = all_movies.filter(mov => mov.genre_ids.includes(parseInt(req.body.hid_genID)));
        
            let movies2 = [];
            let movies1 = [];
            if(all_movies.length > 21){
                movies1 = all_movies.slice(0, 21);
                movies2 = all_movies.slice(21, all_movies.length - 21);
            }else{
              movies1 = all_movies;
            }
  
            res.render('pages/movie_list', { 
                movies1: movies1, 
                movies2: movies2, 
                movies3: "", 
                movies4: "", 
                movies5: "", 
                geners: geners, 
                action: "all",
                msg: "All Movies" + name 
            });
        }
        // res.render('pages/movielist', { movies1: mov1, movies2: mov2, movies3: mov3, geners:geners });
      }
      else if(req.body.hid_menu === 'now_play'){
        const response_now_ply_mov = await axios.get(`https://api.themoviedb.org/3/movie/now_playing?api_key=${process.env.API_KEY}`);
        const now_ply_mov = response_now_ply_mov.data.results;
  
        const response_now_ply_mov2 = await axios.get(`https://api.themoviedb.org/3/movie/now_playing?page=2&api_key=${process.env.API_KEY}`);
        const now_ply_mov2 = response_now_ply_mov2.data.results;
  
        const response_now_ply_mov3 = await axios.get(`https://api.themoviedb.org/3/movie/now_playing?page=3&api_key=${process.env.API_KEY}`);
        const now_ply_mov3 = response_now_ply_mov3.data.results;
  
        const response_now_ply_mov4 = await axios.get(`https://api.themoviedb.org/3/movie/now_playing?page=4&api_key=${process.env.API_KEY}`);
        const now_ply_mov4 = response_now_ply_mov4.data.results;
  
        const response_now_ply_mov5 = await axios.get(`https://api.themoviedb.org/3/movie/now_playing?page=5&api_key=${process.env.API_KEY}`);
        const now_ply_mov5 = response_now_ply_mov5.data.results;
        
        if(req.body.hid_genID > 0){
          var all_movies = [...now_ply_mov, ...now_ply_mov2, ...now_ply_mov3, ...now_ply_mov4, ...now_ply_mov5];
          all_movies = all_movies.filter(mov => mov.genre_ids.includes(parseInt(req.body.hid_genID)));
      
          let movies2 = [];
          let movies1 = [];
          if(all_movies.length > 21){
              movies1 = all_movies.slice(0, 21);
              movies2 = all_movies.slice(21, all_movies.length - 21);
          }else{
            movies1 = all_movies;
          }  
      
          res.render('pages/movie_list', { 
              movies1: movies1, 
              movies2: movies2, 
              movies3: "", 
              movies4: "", 
              movies5: "", 
              geners: geners, 
              action: "now_play",
              msg: "Now Playing" + name
          });
          }else{
            res.render('pages/movie_list', { 
              movies1: now_ply_mov, 
              movies2: now_ply_mov2, 
              movies3: now_ply_mov3, 
              movies4: now_ply_mov4, 
              movies5: now_ply_mov5, 
              geners:geners, 
              action:"now_play",
              msg: "Now Playing" + name
             });
        }
  
        // res.render('pages/movielist', { movies1: now_ply_mov, movies2: now_ply_mov2, movies3: now_ply_mov3, movies4: "", movies5: "", geners:geners, action:"now_play" });
      }
      else if(req.body.hid_menu === 'popular'){
          const response_pop_mov = await axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${process.env.API_KEY}`);
          const popular_mov = response_pop_mov.data.results;
  
          const response_pop_mov2 = await axios.get(`https://api.themoviedb.org/3/movie/popular?page=2&api_key=${process.env.API_KEY}`);
          const popular_mov2 = response_pop_mov2.data.results;
  
          const response_pop_mov3 = await axios.get(`https://api.themoviedb.org/3/movie/popular?page=3&api_key=${process.env.API_KEY}`);
          const popular_mov3 = response_pop_mov3.data.results;
  
          const response_pop_mov4 = await axios.get(`https://api.themoviedb.org/3/movie/popular?page=4&api_key=${process.env.API_KEY}`);
          const popular_mov4 = response_pop_mov4.data.results;
  
          const response_pop_mov5 = await axios.get(`https://api.themoviedb.org/3/movie/popular?page=5&api_key=${process.env.API_KEY}`);
          const popular_mov5 = response_pop_mov5.data.results;
  
          if(req.body.hid_genID > 0){
            var all_movies = [...popular_mov, ...popular_mov2, ...popular_mov3, ...popular_mov4, ...popular_mov5];
            all_movies = all_movies.filter(mov => mov.genre_ids.includes(parseInt(req.body.hid_genID)));
        
            let movies2 = [];
            let movies1 = [];
            if(all_movies.length > 21){
                movies1 = all_movies.slice(0, 21);
                movies2 = all_movies.slice(21, all_movies.length - 21);
            }else{
              movies1 = all_movies;
            }  
        
            res.render('pages/movie_list', { 
                movies1: movies1, 
                movies2: movies2, 
                movies3: "", 
                movies4: "", 
                movies5: "", 
                geners: geners, 
                action: "popular",
                msg: "Popular" + name
            });
            }else{
              res.render('pages/movie_list', { 
                movies1: popular_mov, 
                movies2: popular_mov2, 
                movies3: popular_mov3, 
                movies4: popular_mov4, 
                movies5: popular_mov5, 
                geners:geners, 
                action:"popular",
                msg: "Popular" + name
               });
            }
      }
      else if(req.body.hid_menu === 'upcoming'){
          const response_up_mov1 = await axios.get(`https://api.themoviedb.org/3/movie/upcoming?api_key=${process.env.API_KEY}`);
          const upcoming_mov1 = response_up_mov1.data.results;
  
          const response_up_mov2 = await axios.get(`https://api.themoviedb.org/3/movie/upcoming?page=2&api_key=${process.env.API_KEY}`);
          const upcoming_mov2 = response_up_mov2.data.results;
  
          const response_up_mov3 = await axios.get(`https://api.themoviedb.org/3/movie/upcoming?page=3&api_key=${process.env.API_KEY}`);
          const upcoming_mov3 = response_up_mov3.data.results;
  
          const response_up_mov4 = await axios.get(`https://api.themoviedb.org/3/movie/upcoming?page=4&api_key=${process.env.API_KEY}`);
          const upcoming_mov4 = response_up_mov4.data.results;
  
          const response_up_mov5 = await axios.get(`https://api.themoviedb.org/3/movie/upcoming?page=5&api_key=${process.env.API_KEY}`);
          const upcoming_mov5 = response_up_mov5.data.results;
  
          if(req.body.hid_genID > 0){
            var all_movies = [...upcoming_mov1, ...upcoming_mov2, ...upcoming_mov3, ...upcoming_mov4, ...upcoming_mov5];
            all_movies = all_movies.filter(mov => mov.genre_ids.includes(parseInt(req.body.hid_genID)));
        
            let movies2 = [];
            let movies1 = [];
            if(all_movies.length > 21){
                movies1 = all_movies.slice(0, 21);
                movies2 = all_movies.slice(21, all_movies.length - 21);
            }else{
              movies1 = all_movies;
            }
    
        
            res.render('pages/movie_list', { 
                movies1: movies1, 
                movies2: movies2, 
                movies3: "", 
                movies4: "", 
                movies5: "", 
                geners: geners, 
                action: "upcoming",
                msg: "Upcoming" + name 
            });
            }else{
              res.render('pages/movie_list', { 
                  movies1: upcoming_mov1, 
                  movies2: upcoming_mov2, 
                  movies3: upcoming_mov3, 
                  movies4: upcoming_mov4,
                  movies5: upcoming_mov5, 
                  geners: geners, 
                  action: "upcoming",
                  msg: "Upcoming" + name
              });
            }  
      }else if(req.body.hid_menu === 'top-rated'){
        const response_top_mov1 = await axios.get(`https://api.themoviedb.org/3/movie/top_rated?api_key=${process.env.API_KEY}`);
        const top_mov1 = response_top_mov1.data.results;
  
        const response_top_mov2 = await axios.get(`https://api.themoviedb.org/3/movie/top_rated?page=2&api_key=${process.env.API_KEY}`);
        const top_mov2 = response_top_mov2.data.results;
  
        const response_top_mov3 = await axios.get(`https://api.themoviedb.org/3/movie/top_rated?page=3&api_key=${process.env.API_KEY}`);
        const top_mov3 = response_top_mov3.data.results;
  
        const response_top_mov4 = await axios.get(`https://api.themoviedb.org/3/movie/top_rated?page=4&api_key=${process.env.API_KEY}`);
        const top_mov4 = response_top_mov4.data.results;
  
        const response_top_mov5 = await axios.get(`https://api.themoviedb.org/3/movie/top_rated?page=5&api_key=${process.env.API_KEY}`);
        const top_mov5 = response_top_mov5.data.results;
  
        if(req.body.hid_genID > 0){
          var all_movies = [...top_mov1, ...top_mov2, ...top_mov3, ...top_mov4, ...top_mov5];
          all_movies = all_movies.filter(mov => mov.genre_ids.includes(parseInt(req.body.hid_genID)));
      
          let movies2 = [];
          let movies1 = [];
          if(all_movies.length > 21){
              movies1 = all_movies.slice(0, 21);
              movies2 = all_movies.slice(21, all_movies.length - 21);
          }else{
            movies1 = all_movies;
          }
  
      
          res.render('pages/movie_list', { 
              movies1: movies1, 
              movies2: movies2, 
              movies3: "", 
              movies4: "", 
              movies5: "", 
              geners: geners, 
              action: "top-rated",
              msg: "Top Rated" + name
          });
          }else{
            res.render('pages/movie_list', { 
                movies1: top_mov1, 
                movies2: top_mov2, 
                movies3: top_mov3, 
                movies4: top_mov4,
                movies5: top_mov5, 
                geners: geners, 
                action: "top-rated",
                msg: "Top Rated" + name
        });
      }    
    }
    } catch (error) {
      console.error(error);
      res.send('An error occurred');
    }
  });

  module.exports = mvlist_router;