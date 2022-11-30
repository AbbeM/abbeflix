const express = require('express');
const {
  getAllUsers,
  crateUser,
  getUser,
  updateUser,
  deleteUser,
} = require('../controllers/userController');

const router = express.Router();

router.route('/').get(getAllUsers).post(crateUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
