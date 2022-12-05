const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const movieSchema = new mongoose.Schema({
  adult: {
    type: Boolean,
    default: false,
  },
  backdrop_path: {
    type: String,
    default: null,
  },
  belongs_to_collection: {
    type: Object,
    default: null,
  },
  budget: {
    type: Number,
    required: [true, 'Du måste ange budget!'],
  },
  genres: {
    type: Array,
    required: [true, 'Du måste ange genre!'],
  },
  homepage: {
    type: String,
    default: null,
  },
  imdb_id: {
    type: String,
    default: null,
    minLength: [9, 'Ange rätt id! Iden måste innehålla 9 karaktärer!'],
    maxLength: [9, 'Ange rätt id! Iden måste innehålla 9 karaktärer!'],
    validate: {
      validator: function (val) {
        return /^tt[0-9]{7}/.test(val);
      },
      message: 'Ange rätt id!',
    },
  },
  original_language: String,
  original_title: {
    type: String,
    required: [true, 'Du måste ange rubriken!'],
  },
  overview: {
    type: String,
    required: [true, 'Du måste ange sammanfattning!'],
  },
  popularity: {
    type: Number,
    default: 0,
  },
  poster_path: {
    type: String,
    default: null,
  },
  production_companies: [
    {
      name: String,
      id: Number,
      logo_path: {
        type: String,
        default: null,
      },
      origin_country: String,
    },
  ],
  production_countries: [
    {
      iso_3166_1: String,
      name: String,
    },
  ],
  release_date: {
    type: Date,
    required: [true, 'Du måste ange utgivningsdatum!'],
  },
  revenue: Number,
  runtime: {
    type: Number,
    default: null,
  },
  spoken_languages: [
    {
      iso_639_1: String,
      name: String,
    },
  ],
  status: {
    type: String,
    enum: {
      values: [
        'Rumored',
        'Planned',
        'In Production',
        'Post Production',
        'Released',
        'Canceled',
      ],
      message: 'Ange rätt läge!',
    },
  },
  tagline: {
    type: String,
    default: null,
  },
  title: String,
  video: Boolean,
  vote_average: {
    type: Number,
    default: 0,
  },
  vote_count: {
    type: Number,
    default: 0,
  },
});

movieSchema.virtual('duration').get(function () {
  return this.budget / 8;
});

// DOCUMENT MEDELWARE: Runs before .save() and .create()
movieSchema.pre('save', function (next) {
  this.slug = slugify(this.original_title, { lower: true });

  next();
});

// QUERY MEDELWARE: Runs before .find()
movieSchema.pre(/^find/, function (next) {
  this.find({ secret: { $ne: true } });
  this.start = Date.now();

  next();
});

movieSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds!`);
  next();
});

// AGGREGATION MEDELWARE
movieSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secret: { $ne: true } } });
  next();
});

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;

// movieSchema.pre('save', function (next) {
//   console.log('Sparar filmen...');

//   next();
// });

// movieSchema.post('save', function (doc, next) {
//   console.log(doc);

//   next();
// });
