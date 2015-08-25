'use strict';

var express = require('express');
var controller = require('./caf.controller');

var router = express.Router();

router.post('/', controller.caf);

module.exports = router;
