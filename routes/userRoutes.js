const express = require('express');
const { signup } = require('../controllers/authController');
const {
  getAllUsers,
  crateUser,
  getUser,
  updateUser,
  deleteUser,
} = require('../controllers/userController');

const router = express.Router();

router.post('/signup', signup);

router.route('/').get(getAllUsers).post(crateUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
