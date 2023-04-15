require('dotenv').config();
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');

const { requestLogger, errorLogger } = require('./middlewares/logger');
const router = require('./routes/routes');
const BadRequestErr = require('./errors/BadRequestErr');
const ConflictErr = require('./errors/ConflictErr');

const { PORT = 3000 } = process.env;
const app = express();

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb')
  .then(() => {
    console.log('Connected');
  })
  .catch((error) => {
    console.log(`Error during connection ${error}`);
  });
app.use(cors({
  origin: ['https://olecyamesto.nomoredomains.work',
    'https://olecyamesto.nomoredomains.work',
    'http://olecyamesto.nomoredomains.work',
    'http://localhost:3000'],
  credentials: true,
}));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});
app.use('/', router);

app.use(errorLogger);

app.use(errors());
app.use((err, req, res, next) => {
  let error = err;
  if (err.name === 'ValidationError' || err.name === 'CastError') {
    error = new BadRequestErr('Неверные данные запроса');
  }
  if (err.code === 11000) {
    error = new ConflictErr('Пользователь с такими e-mail уже существует');
    console.log(error.message);
    console.log(error.statusCode);
  }
  if (error.statusCode === 500 || !error.statusCode) {
    error.statusCode = 500;
    error.message = 'Произошла ошибка сервера';
  }

  res.status(error.statusCode).send({ message: error.message });
  next();
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
