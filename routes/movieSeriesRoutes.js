const express = require('express');
const { protect, restrictTo } = require('../controllers/authController');
const {
  getAllMovieSeries,
  createMovieSeries,
  getMovieSeries,
  updateMovieSeries,
  deleteMovieSeries,
} = require('../controllers/movieSeriesController');

const router = express.Router();

router.use(protect, restrictTo('admin'));

router.route('/').get(getAllMovieSeries).post(createMovieSeries);

router
  .route('/:id')
  .get(getMovieSeries)
  .patch(updateMovieSeries)
  .delete(deleteMovieSeries);

module.exports = router;
