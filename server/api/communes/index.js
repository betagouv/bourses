'use strict';

var express = require('express');
var controller = require('./communes.controller');

var router = express.Router();

router.get('/:codePostal', controller.communes);

module.exports = router;
