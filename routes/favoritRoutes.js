const express = require('express');
const { protect, restrictTo } = require('../controllers/authController');
const {
  getAllFavorites,
  createFavorit,
  setMovieUserIds,
  getFavorit,
  updateFavorit,
  deleteFavorit,
} = require('../controllers/favoritController');

const router = express.Router({ mergeParams: true });

router.use(protect);

router
  .route('/')
  .get(getAllFavorites)
  .post(restrictTo('user'), setMovieUserIds, createFavorit);

router.route('/:id').get(getFavorit).patch(updateFavorit).delete(deleteFavorit);

module.exports = router;
