const mongoose = require('mongoose');
const Movie = require('./movieModel');

const reviewSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      required: [true, 'Du måste ange betyg!'],
      min: 1,
      max: 10,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    movie: {
      type: mongoose.Schema.ObjectId,
      ref: 'Movie',
      required: [true, 'Review must belong to a movie.'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user.'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

reviewSchema.statics.calcAvrageRatings = async function (movieId) {
  const stats = await this.aggregate([
    {
      $match: { movie: movieId },
    },
    {
      $group: {
        _id: '$movie',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);

  if (stats.length > 0) {
    await Movie.findByIdAndUpdate(movieId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await Movie.findByIdAndUpdate(movieId, {
      ratingsQuantity: 0,
      ratingsAverage: 0,
    });
  }
};

reviewSchema.post('save', function () {
  // this points to current review
  this.constructor.calcAvrageRatings(this.movie);
});

reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.findOne();
  next();
});

reviewSchema.post(/^findOneAnd/, async function () {
  // await this.findOne(); does NOT work here, query has alredy executed
  await this.r.constructor.calcAvrageRatings(this.r.movie);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
