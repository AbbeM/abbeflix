const express = require('express');
const { protect, restrictTo } = require('../controllers/authController');
const reviewRouter = require('./reviewRoutes');
const {
  getAllMovies,
  createMovie,
  getMovie,
  updateMovie,
  deleteMovie,
  aliasTopMovies,
  getMovieStats,
  getMonthlyPlan,
} = require('../controllers/movieController');

const router = express.Router();

// router.param('id', checkID);

router.use('/:movieId/reviews', reviewRouter);

router.route('/movie-stats').get(getMovieStats);
router.route('/monthly-plan/:year').get(getMonthlyPlan);
router.route('/top-10').get(aliasTopMovies, getAllMovies);
router
  .route('/')
  .get(protect, getAllMovies)
  .post(protect, restrictTo('admin', 'member'), createMovie);
router
  .route('/:id')
  .get(getMovie)
  .patch(updateMovie)
  .delete(protect, restrictTo('admin', 'member'), deleteMovie);

module.exports = router;
