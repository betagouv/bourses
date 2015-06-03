'use strict';

var express = require('express');
var controller = require('./user.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', auth.hasRole('admin'), controller.index);

router.get('/me', auth.isAuthenticated(), controller.me);

router.get('/:id', auth.isAuthenticated(), controller.show);

module.exports = router;
