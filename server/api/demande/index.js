'use strict';

var express = require('express');
var controller = require('./demande.controller');
var auth = require('../../oauth/auth.service');

var router = express.Router();

router.post('/:college', controller.create);

router.post('/:id/notification', auth.isAuthenticated(), controller.saveNotification);
router.get('/:id/notification', auth.isAuthenticated(), controller.downloadNotification);

router.get('/:id/:key', auth.isAuthenticated(), controller.show);
router.get('/:id/:key/download', auth.isAuthenticated(), controller.download);
router.post('/comment/:id', auth.isAuthenticated(), controller.save);

module.exports = router;
