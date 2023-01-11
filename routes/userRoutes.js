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
  getMe,
} = require('../controllers/userController');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);

router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);

// Protect all those routes after this medelware
router.use(protect);
router.patch('/updatePassword', updatePassword);

router.get('/me', getMe, getUser);
router.patch('/updateMe', updaterMe);
router.delete('/deleteMe', deleteMe);

router.use(restrictTo('admin'));

router.route('/').get(getAllUsers).post(crateUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
