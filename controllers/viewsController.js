const Movie = require('../models/movieModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getMovies = catchAsync(async (req, res, next) => {
  // 1) Get Movie Data From Collection
  const actionMovies = await Movie.find({ genres: { $in: ['Action'] } }).limit(
    20
  );

  const top10 = await Movie.find().sort({ popularity: -1 }).limit(10);

  // 2) Build Templet
  // 3) Render that templet using movie data from 1)

  res.status(200).render('movies', {
    title: 'Filmer',
    actionMovies,
    top10,
  });
});

exports.getMovie = catchAsync(async (req, res, next) => {
  // 1) Get Movie Data From Collection
  const movie = await Movie.findById(req.params.id);

  const actionMovies = await Movie.find({ genres: { $in: ['Action'] } }).limit(
    20
  );

  if (!movie) {
    return next(new AppError('Ingen film hittades', 404));
  }

  // 3) Render that templet using movie data from 1)
  res.status(200).render('movie', {
    // title: movie.originalTitle,
    movie,
    actionMovies,
  });
});

exports.getAuth = catchAsync(async (req, res, next) => {
  res.status(200).render('auth', {
    title: 'logga In På Ditt Konto',
  });
});

exports.getMe = catchAsync(async (req, res, next) => {
  res.status(200).render('me', {
    title: 'Mina Sidor',
  });
});
