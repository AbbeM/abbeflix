const Favorit = require('../models/favoritModel');
const Movie = require('../models/movieModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const { deleteOne, updateOne, createOne, getAll } = require('./handlerFactory');

exports.aliasTopMovies = (req, res, next) => {
  req.query.limit = '10';
  req.query.sort = '-popularity';
  req.query.fields = 'original_title,genres';

  next();
};

exports.setMovieUserIds = (req, res, next) => {
  // Allow nested routes
  if (!req.body.movie) req.body.movie = req.params.movieId;
  if (!req.body.user) req.body.user = req.user.id;

  next();
};

exports.getAllMovies = getAll(Movie, { user: false });

exports.getMovie = catchAsync(async (req, res, next) => {
  const movie = await Movie.findById(req.params.id).populate('reviews');
  const favorit = await Favorit.find({
    user: req.user.id,
    movie: req.params.id,
  });

  const isFavorite = favorit.length > 0;

  if (!movie) {
    return next(new AppError('No document found with that id', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      movie,
      isFavorite,
    },
  });
});

exports.createMovie = createOne(Movie);
exports.updateMovie = updateOne(Movie);
exports.deleteMovie = deleteOne(Movie);

exports.getMovieStats = catchAsync(async (req, res, next) => {
  const stats = await Movie.aggregate([
    {
      $match: { budget: { $gte: 0 } },
    },
    {
      $group: {
        _id: { $toUpper: '$funny' },
        numMovies: { $sum: 1 },
        avgRating: { $avg: '$popularity' },
        avgRuntime: { $avg: '$runtime' },
        minRuntime: { $min: '$runtime' },
        maxRuntime: { $max: '$runtime' },
        sumRuntime: { $sum: '$runtime' },
      },
    },
    {
      $sort: { avgRuntime: 1 },
    },
    // {
    //   $match: { _id: { $ne: 'NOT-FUN' } },
    // },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;

  const plan = await Movie.aggregate([
    {
      $unwind: '$genres',
    },
    {
      $match: {
        release_date: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        // _id: { $month: '$release_date' },
        _id: '$genres',
        numMovies: { $sum: 1 },
        movies: { $push: '$original_title' },
      },
    },
    {
      $addFields: { genre: '$_id.name' },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: { numMovies: -1 },
    },
    {
      $limit: 100,
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      plan,
    },
  });
});
