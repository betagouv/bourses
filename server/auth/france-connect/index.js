'use strict';

var express = require('express');
var passport = require('passport');

var router = express.Router();

router.get('/', passport.authenticate('france-connect'));

router.get('/callback', passport.authenticate('france-connect', { failureRedirect: '/' }), function (req, res) {
  res.redirect('/connection');
});

module.exports = router;
