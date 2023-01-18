const express = require('express');
const { protect, restrictTo } = require('../controllers/authController');
const { createGenre, getGenre } = require('../controllers/genreController');

const router = express.Router();

router.route('/').post(protect, restrictTo('admin'), createGenre);
router.route('/:id').get(getGenre);

module.exports = router;
