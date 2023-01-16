const mongoose = require('mongoose');

const favoritSchema = mongoose.Schema(
  {
    createdAt: {
      type: Date,
      default: Date.now,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Du måste ange användare'],
    },
    movie: {
      type: mongoose.Schema.ObjectId,
      ref: 'Movie',
      required: [true, 'Du måste ange filmen'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// favoritSchema.pre(/^find/, async function (next) {
//   this.find({ user: '63c25c1b3d25226204dbf41a' });
//   next();
// });

const Favorit = mongoose.model('Favorit', favoritSchema);

module.exports = Favorit;
