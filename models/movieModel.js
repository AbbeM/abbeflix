const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Filmen måste innehålla namn!'],
    unique: [true, 'Namnet måste vara unikt!'],
  },
  IMDB: {
    type: Number,
    default: 4.5,
  },
});

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;
