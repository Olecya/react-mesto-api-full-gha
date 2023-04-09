const JWT_KEY_SECRET = 'TOOOP-SICRET';
const allowedCors = [
  'https://olecyamesto.nomoredomains.work/sign-in',
  'http://olecyamesto.nomoredomains.work',
  'localhost:3000'
];

module.exports = {
  JWT_KEY_SECRET, allowedCors
};
