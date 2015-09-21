'use strict';

var express = require('express');
var controller = require('./etablissement.controller');
var auth = require('../../oauth/auth.service');

var router = express.Router();

router.get('/:id', auth.isAuthenticated(), controller.show);
router.get('/byId/:id', controller.showById);
router.put('/:id', auth.isAuthenticated(), controller.update);
router.get('/:id/demandes', auth.isAuthenticated(), controller.demandes);
router.get('/:id/wrongYear', auth.isAuthenticated(), controller.wrongYear);
router.get('/:id/count', auth.isAuthenticated(), controller.count);
router.get('/', controller.query);

module.exports = router;
