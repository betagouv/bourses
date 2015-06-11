'use strict';

var express = require('express');
var controller = require('./etablissement.controller');

var router = express.Router();

router.get('/:id/:key', controller.show);
router.get('/', controller.query);

module.exports = router;
