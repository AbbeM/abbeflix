const express = require('express');
const {
  isLoggedIn,
  protect,
  requireAuth,
} = require('../controllers/authController');
const {
  getMovies,
  getMovie,
  getAuth,
  getMe,
  getMyList,
} = require('../controllers/viewsController');

const router = express.Router();

router.use(isLoggedIn);

router.get('/', getMovies);
router.get('/movie/:id', protect, requireAuth, getMovie);

router.get('/auth', getAuth);
router.get('/me', protect, requireAuth, getMe);
router.get('/myList', protect, requireAuth, getMyList);

module.exports = router;
