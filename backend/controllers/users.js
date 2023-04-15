const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const ConflictErr = require('../errors/ConflictErr');
const NotFoundErr = require('../errors/NotFoundErr');
const BadRequestErr = require('../errors/BadRequestErr');
const User = require('../models/user');
const { JWT_KEY_SECRET } = require('../utils/config');

const { NODE_ENV, JWT_SECRET } = process.env;

const getUsers = async (req, res, next) => User.find({})
  .then((users) => {
    res.send(users);
  })
  .catch((e) => next(e));

const getUserId = async (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        next(new NotFoundErr('Запрашиваемый пользователь не найден'));
      }
    })
    .catch((e) => next(e));
};

const getUserMe = async (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (user) res.send(user);
      if (!user) {
        next(new NotFoundErr('Запрашиваемый пользователь не найден'));
      }
    })
    .catch((err) => next(err));
};

const createUser = async (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  return bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        name, about, avatar, email, password: hash,
      })
        .then((user) => {
          const { _id } = user;
          res.status(201).send({
            user: {
              _id, name, about, avatar, email,
            },
          });
        })
        .catch((error) => {
          console.log(error);
          if (error.name === 'ValidationError') {
            next(new BadRequestErr('Неверные данные'));
            return;
          }
          if (error.code === 11000) {
            next(new ConflictErr('Пользователь с такими e-mail уже существует'));
          } else {
            next(error);
          }
        });
    })
    .catch((e) => next(e));
};

const patchUser = async (req, res, next) => {
  const userId = req.user._id;
  const { name, about } = req.body;

  return User.findByIdAndUpdate(userId, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        next(new NotFoundErr('Запрашиваемый пользователь не найден'));
      }
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequestErr('Неверные данные'));
      } else {
        next(error);
      }
    });
};

const patchUserAvatar = (req, res, next) => {
  const userId = req.user._id;
  const { avatar } = req.body;

  User.findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (user) res.send(user);
      else {
        next(new NotFoundErr('Запрашиваемый пользователь не найден'));
      }
    })
    .catch((error) => {
      // console.log(error);
      if (error.name === 'CastError') {
        next(new BadRequestErr('Неверные данные'));
      } else {
        next(error);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  console.log(email, password);
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV ? JWT_SECRET : JWT_KEY_SECRET,
        { expiresIn: '7d' },
      );
      res.send({ token });
      // res.cookie('jwt', token, { httpOnly: true, maxAge: 3600000 * 24 * 7 }).send({token: true});
    })
    .catch((e) => next(e));
};
module.exports = {
  createUser, getUsers, getUserId, patchUser, patchUserAvatar, login, getUserMe,
};
