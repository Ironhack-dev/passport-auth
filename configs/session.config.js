const session = require('express-session');

module.exports = session({
  secret: 'webdev',
  resave: true,
  saveUninitialized: true,
});
