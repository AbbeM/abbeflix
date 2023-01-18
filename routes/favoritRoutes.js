const express = require('express');
const { protect } = require('../controllers/authController');
const {
  getAllFavorites,
  createFavorit,
  setMovieUserIds,
  deleteFavorit,
} = require('../controllers/favoritController');

const router = express.Router({ mergeParams: true });

router.use(protect, setMovieUserIds);

router
  .route('/')
  .get(getAllFavorites)
  .post(createFavorit)
  .delete(deleteFavorit);

module.exports = router;
