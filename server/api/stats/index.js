'use strict';

var express = require('express');
var controller = require('./stats.controller');

var router = express.Router();

router.get('/etablissement', controller.etablissement);
router.get('/history', controller.history);
router.get('/historyTotal', controller.historyTotal);

module.exports = router;
