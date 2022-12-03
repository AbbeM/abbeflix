const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  original_title: {
    type: String,
    required: [true, 'Filmen måste innehålla namn!'],
    trim: true,
    maxLength: [40, 'Rubriken är för lång!'],
    minLength: [2, 'Rubriken är för kort!'],
  },
  adult: {
    type: Boolean,
    default: false,
  },
  backdrop_bath: {
    type: String,
    default: null,
  },
  belongs_to_collection: {
    type: Object,
    default: null,
  },
  budget: {
    type: Number,
    required: [true, 'Du måste ange budgetet!'],
  },
  genres: [String],
  imdb_id: {
    type: String,
    default: null,
  },
  original_language: String,
  popularity: {
    type: Number,
    default: 0,
  },
  poster_path: {
    type: String,
    default: null,
  },
  release_date: {
    type: Date,
    // required: [true, 'Du måste ange utgivningsdatum!'],
  },
  revenue: {
    type: Number,
    default: null,
  },
  runtime: {
    type: Number,
    default: 0,
  },
  spoken_languages: [String],
  status: {
    type: String,
    required: [true, 'Du måste ange status!'],
  },
  tagline: {
    type: String,
    default: null,
  },
  title: {
    type: String,
    required: [true, 'Du måste ange rubriken!'],
    trim: true,
    maxLength: [40, 'Rubriken är för lång!'],
    minLength: [2, 'Rubriken är för kort!'],
  },
  summary: {
    type: String,
    required: [true, 'Du måste ange sammanfattningen!'],
    trim: true,
    maxLength: [400, 'Sammanfattningen är för lång!'],
    minLength: [20, 'Sammanfattningen är för kort!'],
  },
  trailer_url: {
    type: String,
    required: [true, 'Du måste ange adressen till trailern!'],
  },
});

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;
