const Genre = require('../models/genreModel');
const { getOne, createOne } = require('./handlerFactory');

exports.getGenre = getOne(Genre);
exports.createGenre = createOne(Genre);
