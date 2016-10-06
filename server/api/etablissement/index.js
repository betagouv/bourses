'use strict';

var express = require('express');
var controller = require('./etablissement.controller');
var Etablissement = require('./etablissement.model');
var auth = require('../../oauth/auth.service');

var router = express.Router();

router.get('/:human_id', auth.isAuthenticated(), controller.show);
router.get('/byId/:id', controller.showById);
router.put('/:human_id', auth.isAuthenticated(), controller.update);
router.get('/:human_id/demandes', auth.isAuthenticated(), controller.demandes);
router.get('/:human_id/compta', auth.isAuthenticated(), controller.compta);

router.put('/:human_id/password', auth.isAuthenticated(), controller.changePassword);
router.get('/:human_id/notifications', auth.isAuthenticated(), controller.notifications);
router.get('/:human_id/listeDemandes', auth.isAuthenticated(), controller.listeDemandes);
router.get('/:human_id/listeRIBs', auth.isAuthenticated(), controller.listeRIBs);
router.get('/:human_id/aideSiecle', auth.isAuthenticated(), controller.aideSiecle);

router.get('/:human_id/wrongYear', auth.isAuthenticated(), controller.wrongYear);
router.get('/:human_id/count', auth.isAuthenticated(), controller.count);
router.get('/', controller.query);

router.param('human_id', function(req, res, next, id) {
  Etablissement
    .findOne({human_id: req.params.human_id})
    .exec(function(err, etablissement) {
      if (err) return next(err);
      if (!etablissement) return res.sendStatus(404);

      req.etablissement = etablissement;
      next();
    });
});

router.param('id', function(req, res, next, id) {
  Etablissement
    .findById(req.params.id)
    .exec(function(err, etablissement) {
      if (err) return next(err);
      if (!etablissement) return res.sendStatus(404);

      req.etablissement = etablissement;
      next();
    });
});

module.exports = router;
