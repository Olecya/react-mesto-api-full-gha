const jwt = require('jsonwebtoken');

const { JWT_KEY_SECRET } = require('../utils/config');
const UnauthorizedErr = require('../errors/UnauthorizedErr');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  // console.log(req.headers.authorization.replace('jwt ', ''));
  const cookie = req.headers.authorization.replace('jwt ', '');
  if (!cookie) {
    console.log('мы тут(((');
    next(new UnauthorizedErr('Войдите на сервис или зарегистрируйтесь'));
    return;
  }
  let payload;
  try {
    payload = jwt.verify(cookie, NODE_ENV ? JWT_SECRET : JWT_KEY_SECRET);
  } catch (err) {
    next(new UnauthorizedErr('Войдите на сервис или зарегистрируйтесь'));
    return;
  }
  req.user = payload; // записываем пейлоуд в объект запроса
  next(); // пропускаем запрос дальше
};
