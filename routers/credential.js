const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');
const express = require('express');
const axios = require("axios");
const credentialRouter = express.Router();
var path = require('path');
const { db } = require("./mongodb");

credentialRouter.get('/signup', (req,res)=>{
    res.render('pages/signup', {msg:""});
})

credentialRouter.post('/signup', async (req,res)=>{
    console.log("post......");

    if(req.body.password.length < 9){
        res.render("pages/signup", { msg: 'Password length must be between 6 to 30.' });
    }else{
        // const user = "";
        // // const user = db.findUserByUsername(req.body.name);
        // user = await db.findUserByUsername(req.body.name);
        // if(!user){
            const result = db.createUser(req.body.email, req.body.name, req.body.password);
            console.log(result);
            if((await result).acknowledged){
                res.cookie("username", req.body.name);

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
            }
        // }else{
        //     res.render("pages/signup", { msg: 'User already existed.' });
        // }

        
    }
})

credentialRouter.get('/signin', (req,res)=>{
    res.render('pages/signin', {msg:""});
})


credentialRouter.post('/signin', async (req,res)=>{
    console.log("Sign In post.....")
    try {

        // Verify user credentials
        const loginData = await db.verifyUserCredentials(req.body.name, req.body.password);
        console.log("loginData:", loginData);
        if (loginData.loginResult) {
            // res.status(200).send('Login successful'); // get error
            const latestmovieId = loginData.latestMovie;
            res.cookie("latestMovieId", latestmovieId);
            res.cookie("username", req.body.name);
            
            // render index page
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

        } else {
            res.render("pages/signin", { msg: 'Invalid username or password' });
            // res.status(401).send('Invalid username or password');
        }   
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send('Internal server error');
    }

})

module.exports = credentialRouter;
