const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const User = require('../models/User');
const secure = require('../middlewares/secure.mid');

const router = express.Router();
const bcryptSalt = 10;

router.get('/signup', (req, res, next) => {
  res.render('auth/signup');
});

router.post('/signup', (req, res, next) => {
  const { username, password, email } = req.body;

  if (username === '' || password === '') {
    res.render('auth/signup', { message: 'Please indicate username and password' });
    return;
  }

  // User.findOne({ username:username })
  User.findOne({ email })
    .then((user) => {
      if (user) {
        res.render('auth/signup', { message: 'Username already exists' });
        return;
      }

      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      const newUser = new User({
        username,
        email,
        password: hashPass,
      });

      newUser.save()
        .then(() => res.redirect('/'))
        .catch(error => next(error));
    })
    .catch(error => next(error));
});

router.get('/login', (req, res, next) => {
  res.render('auth/login');
});

router.post('/login', (req, res, next) => {
  passport.authenticate('local-auth', (error, user, message) => {
    if (error) next(error);
    else if (!user) next('No user');
    else {
      req.login(user, (error) => {
        if (error) next(error);
        else res.redirect('/private');
      });
    }
  })(req, res, next);
});

router.get('/private', secure.checkLogin, (req, res, next) => {
  res.render('auth/private', { user: req.user });
});

router.get('/admin', secure.checkRole('ADMIN'), (req, res, next) => {
  res.render('auth/admin');
});

router.get('/logout', (req, res, next) => {
  req.logout();
  res.redirect('/');
});

router.get(
  '/auth/google',
  passport.authenticate('google', {
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
    ],
  }),
);
router.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    successRedirect: '/private',
    failureRedirect: '/login',
  }),
);

module.exports = router;
