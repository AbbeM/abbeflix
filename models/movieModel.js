const mongoose = require('mongoose');
const slugify = require('slugify');
const Actor = require('./actorModel');
const Favorit = require('./favoritModel');

const movieSchema = new mongoose.Schema(
  {
    belongsToCollection: {
      type: Object,
      default: null,
    },
    budget: {
      type: Number,
      required: [true, 'Du måste ange budget!'],
    },
    genres: [
      {
        type: String,
        required: [true, 'Du måste ange genre!'],
      },
    ],
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
    posterPath: {
      type: String,
      default: null,
    },
    productionCompanies: [
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
    releaseDate: {
      type: Date,
      required: [true, 'Du måste ange utgivningsdatum!'],
    },
    revenue: Number,
    runtime: {
      type: Number,
      default: null,
    },
    spokenLanguages: [
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

movieSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'actors',
    select: '-__v',
  });

  next();
});

// DOCUMENT MEDELWARE: Runs before .save() and .create()
movieSchema.pre('save', function (next) {
  this.slug = slugify(this.originalTitle, { lower: true });

  next();
});

// Embedding actors in movies
movieSchema.pre('save', async function (next) {
  await this.actors.map(async (id) => {
    const actor = await Actor.findById(id);
    const actorMovies = [...actor.movies];
    actorMovies.push(this.id);

    await Actor.findByIdAndUpdate(id, { movies: actorMovies });
  });

  next();
});

// QUERY MEDELWARE: Runs before .find()
movieSchema.pre(/^find/, function (next) {
  this.find({ secret: { $ne: true } });

  next();
});

movieSchema.pre(/^find/, async function () {
  const id = this._conditions._id;

  const added = await Favorit.find({ movie: id });

  movieSchema.virtual('addedToList').get(() => added.length > 0);
});

// AGGREGATION MEDELWARE
movieSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secret: { $ne: true } } });
  next();
});

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;
