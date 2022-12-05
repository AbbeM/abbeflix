const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const movieSchema = new mongoose.Schema(
  {
    original_title: {
      type: String,
      required: [true, 'Filmen måste innehålla namn!'],
      trim: true,
      maxLength: [40, 'Rubriken är för lång!'],
      minLength: [2, 'Rubriken är för kort!'],
      // validate: [validator.isAlpha, 'Namen får ej innehålla mer än bokstäver'],
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
      min: [0, '0 är minst!'],
      max: [10, '10 är max!'],
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
      validate: {
        validator: function (val) {
          // this only points to current document on NEW document creation
          return val < this.price;
        },
        message: 'failed {VALUE}',
      },
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
    secret: {
      type: Boolean,
      default: false,
    },
    slug: String,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

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
