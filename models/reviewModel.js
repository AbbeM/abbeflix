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

  await Movie.findByIdAndUpdate(movieId, {
    ratingsQuantity: stats[0].nRating,
    ratingsAverage: stats[0].avgRating,
  });
};

reviewSchema.post('save', function () {
  // this points to current review
  this.constructor.calcAvrageRatings(this.movie);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
