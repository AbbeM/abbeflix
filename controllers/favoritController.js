const Favorit = require('../models/favoritModel');
const {
  getAll,
  getOne,
  createOne,
  updateOne,
  deleteOne,
} = require('./handlerFactory');

exports.setMovieUserIds = (req, res, next) => {
  // Allow nested routes
  if (!req.body.movie) req.body.movie = req.params.movieId;
  if (!req.body.user) req.body.user = req.user.id;

  next();
};

exports.getAllFavorites = getAll(Favorit, { user: true });
exports.getFavorit = getOne(Favorit);
exports.createFavorit = createOne(Favorit);
exports.updateFavorit = updateOne(Favorit);
exports.deleteFavorit = deleteOne(Favorit);
