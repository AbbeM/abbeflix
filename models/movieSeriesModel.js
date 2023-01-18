const mongoose = require('mongoose');

const movieSeriesSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Du måste ange namnet'],
      unique: [true, 'Namnet på filmserien måste vara unikt'],
    },
    desc: String,
    movies: [{ type: mongoose.Schema.ObjectId, ref: 'Movie' }],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

movieSeriesSchema.index({ name: 1 }, { unique: true });

movieSeriesSchema.pre(/^findOne/, function (next) {
  this.populate({
    path: 'movies',
    select: '_id originalTitle posterPath',
  });

  next();
});

const MovieSeries = mongoose.model('MovieSeries', movieSeriesSchema);

module.exports = MovieSeries;
