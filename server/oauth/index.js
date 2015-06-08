'use strict';

var express = require('express');
var passport = require('passport');
var config = require('../config/environment');

// Passport Configuration
passport.serializeUser(function (user, done) {
	done(null, user);
});

passport.deserializeUser(function (user, done) {
	done(null, user);
});

require('./france-connect/passport').setup(config);

var router = express.Router();

router.use('/fc', require('./france-connect'));

module.exports = router;
