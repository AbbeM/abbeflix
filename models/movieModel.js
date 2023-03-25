const mongoose = require('mongoose');
const slugify = require('slugify');
const Actor = require('./actorModel');
const Genre = require('./genreModel');
const MovieSeries = require('./movieSeriesModel');

const movieSchema = new mongoose.Schema(
  {
    budget: {
      type: Number,
      required: [true, 'Du måste ange budget!'],
    },
    originalLanguage: String,
    originalTitle: {
      type: String,
      required: [true, 'Du måste ange rubriken!'],
      unique: [true, 'Filmen måste vara unik!'],
    },
    overview: {
      type: String,
      required: [true, 'Du måste ange sammanfattning!'],
    },
    posterVertical: {
      type: String,
      default: null,
    },
    posterBackgrund: {
      type: String,
      default: null,
    },
    posterHorizontal: {
      type: String,
      default: null,
    },
    titleImg: String,
    releaseDate: {
      type: Date,
      required: [true, 'Du måste ange utgivningsdatum!'],
    },
    revenue: Number,
    runtime: {
      type: Number,
      default: null,
    },
    slug: String,
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    ratingsAverage: {
      type: Number,
      default: 0,
      set: (val) => Math.round(val * 10) / 10,
    },
    age: Number,
    quality: String,
    actors: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Actor',
      },
    ],
    genres: [
      {
        type: String,
        required: [true, 'Du måste ange genre.'],
        enum: {
          values: [
            'Action',
            'Anime',
            'Barn och familj',
            'Dokumentärer',
            'Draman',
            'Europeiskt',
            'Fantasy',
            'Fredagsmys',
            'Indie',
            'Internationellt',
            'Internationellt',
            'Komedier',
            'Kortfilmer',
            'Kriminalare',
            'Kritikernas favoriter',
            'Musik och musikaler',
            'Nordiskt',
            'Romantik',
            'Sci-fi',
            'Skräck',
            'Ståuppkomik',
            'Svenskt',
            'Thriller',
          ],
          message: 'Ange rätt gener!',
        },
      },
    ],
    movieSeries: {
      type: mongoose.Schema.ObjectId,
      ref: 'MovieSeries',
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

movieSchema.index({ genres: 1, ratin: -1 });
movieSchema.index({ slug: 1 });

// Virtual populate
movieSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'movie',
  localField: '_id',
});

// DOCUMENT MEDELWARE: Runs before .save() and .create()
movieSchema.pre('save', async function (next) {
  this.slug = slugify(this.originalTitle, { lower: true });

  await this.actors.map(async (actor) => {
    await Actor.findByIdAndUpdate(actor, { $push: { movies: this._id } });
  });

  await this.genres.map(async (genre) => {
    await Genre.findOneAndUpdate(
      { name: genre },
      { $push: { movies: this._id } }
    );
  });

  await MovieSeries.findByIdAndUpdate(this.movieSeries, {
    $push: { movies: this._id },
  });

  next();
});

// QUERY MEDELWARE: Runs before .find()
movieSchema.pre(/^find/, function (next) {
  this.find({ secret: { $ne: true } });

  this.populate({
    path: 'actors',
    select: '-__v',
  });

  this.populate({
    path: 'movieSeries',
    select: '-__v',
  });

  next();
});

// AGGREGATION MEDELWARE
movieSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secret: { $ne: true } } });
  next();
});

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;
