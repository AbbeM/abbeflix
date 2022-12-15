const express = require('express');
const {
  signup,
  login,
  forgotPassword,
  resetPassword,
  protect,
  updatePassword,
  restrictTo,
} = require('../controllers/authController');

const {
  getAllUsers,
  crateUser,
  getUser,
  updateUser,
  deleteUser,
  updaterMe,
  deleteMe,
} = require('../controllers/userController');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);

router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);
router.patch('/updatePassword', protect, updatePassword);
router.patch('/updateMe', protect, updaterMe);
router.delete('/deleteMe', protect, deleteMe);

router
  .route('/')
  .get(protect, restrictTo('admin'), getAllUsers)
  .post(crateUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
