const Movie = require('../models/movie')

const NotFoundError = require('../errors/not-found-error');
const ValidationError = require('../errors/validation-error');
const UnathorizedError = require('../errors/unathorized-error');
const ConflictError = require('../errors/conflict-error');
const { CREATED } = require('../utils/constants');

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
  .then((movies) => res.send(movies))
  .catch(next);
}