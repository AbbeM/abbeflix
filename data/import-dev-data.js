const dotenv = require('dotenv');
const fs = require('fs');
const mongoose = require('mongoose');
const https = require('https');
const got = require('got');
const Movie = require('../models/movieModel');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connection successful 😎'));

// READ JSON FILE
const ids = [];
const movies = [];

// IMPORT DATA INTO DATAABASE
const importData = async () => {
  try {
    // GET DATA FROM MOVIEAPI
    for (let page = 1; page <= 20; page++) {
      const response = await got(
        `https://api.themoviedb.org/3/discover/movie?api_key=c653d5d5d24ef3fdd51c7dc769bb44a7&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${page}&year=2022&with_watch_monetization_types=flatrate`,
        { json: true }
      );

      response.body.results.forEach((el) => {
        ids.push(el.id);
      });

      for (const id of ids) {
        const movieRes = await got(
          `https://api.themoviedb.org/3/movie/${id}?api_key=c653d5d5d24ef3fdd51c7dc769bb44a7`,
          { json: true }
        );

        movies.push(movieRes.body);
        console.log(movieRes.body);
      }
    }

    await Movie.create(movies);
    console.log('Importeringen av data lyckades!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// DELETE ALL DATA FROM COLLECTION
const deleteData = async () => {
  try {
    await Movie.deleteMany();
    console.log('Raderingen av data lyckades!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
