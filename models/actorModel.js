const mongoose = require('mongoose');
const Movie = require('./movieModel');

const actorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Du måste ange medverkandens namn.'],
    },
    photo: String,
    movies: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Movie',
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

actorSchema.pre(/^findOne/, function (next) {
  this.populate({
    path: 'movies',
    select: '_id originalTitle posterPath',
  });

  next();
});

const Actor = mongoose.model('Actor', actorSchema);

module.exports = Actor;
