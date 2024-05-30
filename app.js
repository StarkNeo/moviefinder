const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const { json } = require('body-parser');

const tmdbBaseUrl = 'https://api.themoviedb.org/3';
const PORT = process.env.PORT || 3000;

const app = express();

app.use(cors());
app.use(express.json());

app.listen(PORT, () => {
    console.log("server rised");
})

app.get("/genres", async (req, res) => {
    let genreRequestEndpoint = '/genre/movie/list';
    let requestParams = '?api_key=' + process.env.API_KEY;
    let urlToFetch = tmdbBaseUrl + genreRequestEndpoint + requestParams;
    try {
        let response = await fetch(urlToFetch);
        console.log(response);

        if (response.ok) {
            let jsonResponse = await response.json();
            console.log(jsonResponse);
            let genres = jsonResponse.genres;
            console.log(genres);
            res.status(200).send({ message: genres });
        }

    }
    catch (error) {
        console.log(error);
        res.status(403).send();
    }
    //res.status(200).send({message:"endpoint funcionando"});
})

app.post("/movies", async (req, res) => {
    console.log(req.body);
    let discoverMovieEndpoint = '/discover/movie';
    let requestParams = `?api_key=${process.env.API_KEY}&with_genres=${req.body.selectedGenre}`;
    let urlToFetch = tmdbBaseUrl + discoverMovieEndpoint + requestParams;
    try {
        let response = await fetch(urlToFetch);
        if (response.ok) {
            let jsonResponse = await response.json();
            console.log(jsonResponse);
            let movies = jsonResponse.results;
            console.log(movies);
            res.status(200).send({ movies: movies });

        }
    }
    catch (error) {
        console.log(error);
        res.status(403).send();
    }

});

app.post("/movie/info", async (req, res) => {
    let movieId = req.body.movieId;
    let movieEndpoint = `/movie/${movieId}`;
    let requestParams = `?api_key=${process.env.API_KEY}`;
    let urlToFetch = tmdbBaseUrl + movieEndpoint + requestParams;
    try {
        let response = await fetch(urlToFetch);
        if (response.ok) {
            let movieInfo = await response.json();
            console.log(movieInfo);
            res.status(200).send({info: movieInfo});
        }
    } catch (error) {
        console.log(error);
        res.status(403).send();
    }
})