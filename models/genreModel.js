const mongoose = require('mongoose');

const genreSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Du måste ange genre.'],
      enum: {
        values: [
          'Action',
          'Anime',
          'Barn och familj',
          'Dokumentärer',
          'Draman',
          'Europeiskt',
          'Fantasy',
          'Fredagsmys',
          'Indie',
          'Internationellt',
          'Internationellt',
          'Komedier',
          'Kortfilmer',
          'Kriminalare',
          'Kritikernas favoriter',
          'Musik och musikaler',
          'Nordiskt',
          'Romantik',
          'Sci-fi',
          'Skräck',
          'Ståuppkomik',
          'Svenskt',
          'Thriller',
        ],
        message: 'Ange rätt gener!',
      },
    },
    movies: [{ type: mongoose.Schema.ObjectId, ref: 'Movie' }],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

genreSchema.index({ name: 1 }, { unique: true });

genreSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'movies',
    select: '_id originalTitle posterPath',
  });

  next();
});

const Genre = mongoose.model('Genre', genreSchema);

module.exports = Genre;
