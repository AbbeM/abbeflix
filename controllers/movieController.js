const Movie = require('../models/movieModel');
const APIFeatures = require('../utils/apiFeatures');

exports.aliasTopMovies = (req, res, next) => {
  req.query.limit = '10';
  req.query.sort = '-popularity';
  req.query.fields = 'original_title,genres';

  next();
};

exports.getAllMovies = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getMovie = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);

    res.status(200).json({
      status: 'success',
      data: {
        movie,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.createMovie = async (req, res) => {
  try {
    const newMovie = await Movie.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        movie: newMovie,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.updateMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: 'success',
      data: {
        movie,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getMovieStats = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getMonthlyPlan = async (req, res) => {
  try {
    const year = req.params.year * 1;

    const plan = await Movie.aggregate([
      {
        $unwind: '$genres',
      },
      {
        $match: {
          relaseDate: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $moth: '$relaseDate' },
          numMovies: { $sum: 1 },
          movies: { $push: '$name' },
        },
      },
      {
        $addField: { month: '$_id' },
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
        $limit: 12,
      },
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        plan,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};
