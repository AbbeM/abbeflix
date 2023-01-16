const express = require('express');
const {
  getAllActors,
  createActor,
  getActor,
  updateActor,
  deleteActor,
} = require('../controllers/actorController');
const { protect, restrictTo } = require('../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(getAllActors)
  .post(protect, restrictTo('admin'), createActor);

router
  .route('/:id')
  .get(getActor)
  .patch(protect, restrictTo('admin'), updateActor)
  .delete(protect, restrictTo('admin'), deleteActor);

module.exports = router;
