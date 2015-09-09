'use strict';

var express = require('express');
var controller = require('./connection.controller');

var router = express.Router();

router.get('/svair', controller.svair);

module.exports = router;
