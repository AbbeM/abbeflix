const MovieSeries = require('../models/movieSeriesModel');
const {
  getAll,
  getOne,
  createOne,
  updateOne,
  deleteOne,
} = require('./handlerFactory');

exports.getAllMovieSeries = getAll(MovieSeries, { user: false });
exports.getMovieSeries = getOne(MovieSeries);
exports.createMovieSeries = createOne(MovieSeries);
exports.updateMovieSeries = updateOne(MovieSeries);
exports.deleteMovieSeries = deleteOne(MovieSeries);
