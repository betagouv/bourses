'use strict';

var express = require('express');
var passport = require('passport');
var config = require('../config/environment');
var User = require('../api/user/user.model');

// Passport Configuration
passport.serializeUser(function (user, done) {
	done(null, user);
});

passport.deserializeUser(function (user, done) {
	done(null, user);
});

require('./local/passport').setup(User, config);
require('./france-connect/passport').setup(config);

var router = express.Router();

router.use('/local', require('./local'));
router.use('/fc', require('./france-connect'));

module.exports = router;
