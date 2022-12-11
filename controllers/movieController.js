const Movie = require('../models/movieModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

exports.aliasTopMovies = (req, res, next) => {
  req.query.limit = '10';
  req.query.sort = '-popularity';
  req.query.fields = 'original_title,genres';

  next();
};

exports.getAllMovies = catchAsync(async (req, res, next) => {
  // EXECUTE QUERY
  const features = new APIFeatures(Movie.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const movies = await features.query;

  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: movies.length,
    data: {
      movies,
    },
  });
});

exports.getMovie = catchAsync(async (req, res, next) => {
  const movie = await Movie.findById(req.params.id);

  if (!movie) {
    return next(new AppError('No movie found with that id', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      movie,
    },
  });
});

exports.createMovie = catchAsync(async (req, res, next) => {
  const newMovie = await Movie.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      movie: newMovie,
    },
  });
});

exports.updateMovie = catchAsync(async (req, res, next) => {
  const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!movie) {
    return next(new AppError('No movie found with that id', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      movie,
    },
  });
});

exports.deleteMovie = catchAsync(async (req, res, next) => {
  const movie = await Movie.findByIdAndDelete(req.params.id);

  if (!movie) {
    return next(new AppError('Kunde inte hitta film med angiven id!', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

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
