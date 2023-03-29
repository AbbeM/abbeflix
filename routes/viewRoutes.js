const express = require('express');
const { isLoggedIn, protect } = require('../controllers/authController');
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
router.get('/movie/:id', protect, getMovie);

router.get('/auth', getAuth);
router.get('/me', protect, getMe);
router.get('/myList', protect, getMyList);

module.exports = router;
