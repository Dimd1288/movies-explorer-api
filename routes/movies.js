const router = require('express').Router();
const { getMovies, createMovie, deleteMovie } = require('../controllers/movies')
const { celebrate, Joi } = require('celebrate');
const { URL_REG_EXP } = require('../utils/constants');

router.get('/', getMovies);

router.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().pattern(URL_REG_EXP),
    trailerLink: Joi.string().required().pattern(URL_REG_EXP),
    thumbnail: Joi.string().required().pattern(URL_REG_EXP),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required()
  }),
}), createMovie);

router.delete('/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.number().min(1).required(),
  }),
}), deleteMovie);

module.exports = router;