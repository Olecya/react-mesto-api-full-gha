const express = require('express');
const { celebrate, Joi } = require('celebrate');

const { urlValidator } = require('../utils/urlValidator');

const routerUsers = express.Router();

const {
  getUsers, getUserId, patchUser, patchUserAvatar, getUserMe,
} = require('../controllers/users');

routerUsers.get('/', getUsers);
routerUsers.get('/me', getUserMe);
routerUsers.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().length(24).hex(),
  }),
}), getUserId);

routerUsers.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), patchUser);

routerUsers.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().min(2).custom(urlValidator),
  }),
}), patchUserAvatar);

module.exports = routerUsers;

// { createUser, getUsers, getUser, patchUser, patchUserAvatar }
