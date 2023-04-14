const Movie = require('../models/movie');

const NotFoundError = require('../errors/not-found-error');
const ValidationError = require('../errors/validation-error');
const ConflictError = require('../errors/conflict-error');
const ForbiddenError = require('../errors/forbidden-error');
const { CREATED } = require('../utils/constants');

module.exports.getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => res.send(movies))
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    owner: req.user._id,
    movieId,
    nameRU,
    nameEN,
  })
    .then((movie) => res.status(CREATED).send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new ValidationError('Переданы некорректные данные при сохранении фильма'));
      }
      if (err.code === 11000) {
        return next(new ConflictError('Фильм с указанным id уже существует'));
      }
      return next(err);
    });
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.id).orFail(() => {
    throw new NotFoundError('Фильм с указанным _id не найден');
  }).then((movie) => {
    if (JSON.stringify(movie.owner._id) !== JSON.stringify(req.user._id)) {
      throw new ForbiddenError('Недостаточно прав для выполнения операции');
    }
    Movie.findByIdAndRemove(req.params.id)
      .then(() => res.send(movie))
      .catch(next);
  })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new ValidationError('Переданы некорректные данные карточки фильма'));
      }
      return next(err);
    });
};
