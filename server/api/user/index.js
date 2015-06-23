'use strict';

var express = require('express');
var controller = require('./user.controller');
var auth = require('../../oauth/auth.service');

var router = express.Router();

router.get('/', auth.hasRole('admin'), controller.index);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);
router.get('/me', auth.isAuthenticated(), controller.me);
router.post('/', auth.hasRole('admin'), controller.create);

module.exports = router;
