const Review = require('../models/reviewModel');
const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require('./handlerFactory');

exports.setMovieUserIds = (req, res, next) => {
  // Allow nested routes
  if (!req.body.movie) req.body.movie = req.params.movieId;
  if (!req.body.user) req.body.user = req.user.id;

  next();
};

exports.getAllReviews = getAll(Review);
exports.getReview = getOne(Review);
exports.createReview = createOne(Review);
exports.updateReview = updateOne(Review);
exports.deleteReview = deleteOne(Review);
