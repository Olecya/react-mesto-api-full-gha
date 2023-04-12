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
const { allowedCors } = require('./utils/config');


const { PORT = 3001 } = process.env;
const app = express();

// app.use((req, res, next) => {
//   const { origin } = req.headers;
//   const { method } = req;
//   const requestHeaders = req.headers['access-control-request-headers'];
//   if (allowedCors.includes(origin)) {
//     res.header('Access-Control-Allow-Origin', origin);
//   }
//   if (method === 'OPTIONS') {
//     res.header('Access-Control-Allow-Methods', "GET,HEAD,PUT,PATCH,POST,DELETE");
//     res.header('Access-Control-Allow-Headers', requestHeaders);
//     return res.end();
//   }
// })

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb')
  .then(() => {
    console.log('Connected');
  })
  .catch((error) => {
    console.log(`Error during connection ${error}`);
  });
app.use(cors({ origin: allowedCors, credentials: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(requestLogger);

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
