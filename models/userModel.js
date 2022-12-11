const mongoose = require('mongoose');
const validator = require('validator');

const userShcema = new mongoose.Schema({
  name: {
    Type: String,
    required: [true, 'Du måste ange namn!'],
  },
  email: {
    type: String,
    required: [true, 'Du måste ange email!'],
    unique: [true, 'Email måste vara unik!'],
    lowercase: true,
    validate: [validator.isEmail, 'Vänligen ange en giltig mailadress!']
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
  }
},
{
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})

const User = mongoose.model('User', userShcema);

module.exports = User;
