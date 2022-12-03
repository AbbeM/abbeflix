const express = require('express');
const {
  getAllMovies,
  createMovie,
  getMovie,
  updateMovie,
  deleteMovie,
  aliasTopMovies,
} = require('../controllers/movieController');

const router = express.Router();

// router.param('id', checkID);

router.route('/top-10').get(aliasTopMovies, getAllMovies);
router.route('/').get(getAllMovies).post(createMovie);
router.route('/:id').get(getMovie).patch(updateMovie).delete(deleteMovie);

module.exports = router;
