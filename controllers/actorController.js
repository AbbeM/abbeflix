const Actor = require('../models/actorModel');
const {
  getAll,
  getOne,
  createOne,
  updateOne,
  deleteOne,
} = require('./handlerFactory');

exports.getAllActors = getAll(Actor, { user: false });
exports.getActor = getOne(Actor);
exports.createActor = createOne(Actor);
exports.updateActor = updateOne(Actor);
exports.deleteActor = deleteOne(Actor);
