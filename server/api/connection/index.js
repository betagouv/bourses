'use strict';

var express = require('express');
var controller = require('./connection.controller');

var router = express.Router();

router.get('/svair', controller.svair);
router.get('/fc', controller.fc);
router.get('/fc/logout', controller.logout);

module.exports = router;
