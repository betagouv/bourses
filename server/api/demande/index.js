'use strict';

var express = require('express');
var controller = require('./demande.controller');

var router = express.Router();

router.post('/', controller.create);
router.get('/:id/:key', controller.show);
router.get('/:id/:key/download', controller.download);
router.post('/:id', controller.save);

module.exports = router;
