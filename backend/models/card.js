const mongoose = require('mongoose');

const { urlValidator } = require('../utils/urlValidator');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Наименование карточки обязательная строка'],
    minlength: [2, 'Минимум 2 символа, а у вас {VALUE}'],
    maxlength: [30, 'Превышенно колличесво символов'],
  },
  link: {
    type: String,
    validate: { validator: urlValidator, message: 'Некорректный формат ссылки' },
    required: [true, 'URL карточки обязательная строка'],
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'user',
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    default: [],
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  versionKey: false,
});

module.exports = mongoose.model('card', cardSchema);
