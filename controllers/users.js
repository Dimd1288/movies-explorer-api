const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { CREATED } = require('../utils/constants');

const { NODE_ENV, JWT_SECRET } = process.env;

const NotFoundError = require('../errors/not-found-error');
const ValidationError = require('../errors/validation-error');
const UnathorizedError = require('../errors/unathorized-error');
const ConflictError = require('../errors/conflict-error');

module.exports.createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  bcrypt.hash(password, 10).then((hash) => {
    User.create({
      name, email, password: hash,
    })
      .then((user) => res.status(CREATED).send({
        name: user.name, email: user.email, _id: user._id,
      }))
      .catch((err) => {
        if (err.name === 'ValidationError') {
          return next(new ValidationError('Переданы некорректные данные при создании пользователя'));
        }
        if (err.code === 11000) {
          return next(new ConflictError('Пользователь с указанным email уже существует'));
        }
        return next(err);
      });
  })
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      throw new NotFoundError('Пользователь по указанному _id не найден');
    })
    .then((user) => res.send(user.toJSON()))
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  const { name } = req.body;
  User.findByIdAndUpdate(req.user._id, { name }, { new: true, runValidators: true, context: 'query' })
    .orFail(() => {
      throw new NotFoundError('Пользователь по указанному _id не найден');
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new ValidationError('Переданы некорректные данные при обновлении профиля пользователя'));
      }
      return next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      res.send({
        jwt: jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' }),
      });
    })
    .catch(() => next(new UnathorizedError('Неверные почта или пароль')));
};
