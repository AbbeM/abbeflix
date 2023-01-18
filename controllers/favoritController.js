const Favorit = require('../models/favoritModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const { getAll, createOne } = require('./handlerFactory');

exports.setMovieUserIds = (req, res, next) => {
  // Allow nested routes
  if (!req.body.movie) req.body.movie = req.params.movieId;
  if (!req.body.user) req.body.user = req.user.id;

  next();
};

exports.getAllFavorites = getAll(Favorit, { user: true });
exports.createFavorit = createOne(Favorit);

exports.deleteFavorit = catchAsync(async (req, res, next) => {
  const favorit = await Favorit.findOneAndDelete({
    movie: req.body.movie,
    user: req.user.id,
  });

  if (!favorit) {
    return next(
      new AppError('Kunde inte hitta dokumentet med angiven id!', 404)
    );
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
