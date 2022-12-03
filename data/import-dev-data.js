const dotenv = require('dotenv');
const fs = require('fs');
const mongoose = require('mongoose');
const Movie = require('./../models/movieModel');

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
const movies = JSON.parse(fs.readFileSync(`${__dirname}/movies.json`, 'utf-8'));

// IMPORT DATA INTO DATAABASE
const importData = async () => {
  try {
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
