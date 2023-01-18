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

favoritSchema.index({ movie: 1, user: 1 }, { unique: true });

favoritSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'movie',
    select: '_id originalTitle posterPath',
  });

  next();
});

const Favorit = mongoose.model('Favorit', favoritSchema);

module.exports = Favorit;
