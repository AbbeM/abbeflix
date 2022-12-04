const express = require('express');
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

router.route('/movie-stats').get(getMovieStats);
router.route('/monthly-plan/:year').get(getMonthlyPlan);
router.route('/top-10').get(aliasTopMovies, getAllMovies);
router.route('/').get(getAllMovies).post(createMovie);
router.route('/:id').get(getMovie).patch(updateMovie).delete(deleteMovie);

module.exports = router;
