const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userShcema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Du måste ange namn!'],
    },
    email: {
      type: String,
      required: [true, 'Du måste ange email!'],
      unique: [true, 'Email måste vara unik!'],
      lowercase: true,
      validate: [validator.isEmail, 'Vänligen ange en giltig mailadress!'],
    },
    photot: String,
    password: {
      type: String,
      required: [true, 'Du måste ange lösenord!'],
      minLength: [8, 'Lösenordet måste innehålla minst 8 karaktärer!'],
    },
    passwordConfirm: {
      type: String,
      required: [true, 'Du måste ange lösenord!'],
      validate: {
        // This only works on CREATE and SAVE!!!
        validator: function (el) {
          return el === this.password;
        },
        message: 'Lösenorden matchar inte',
      },
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userShcema.pre('save', async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  // Delete passwordConfirm field
  this.passwordConfirm = undefined;

  next();
});

const User = mongoose.model('User', userShcema);

module.exports = User;
