'use strict';

var _ = require('lodash');
var mongoose = require('mongoose');

var Etablissement = require('./etablissement.model');

exports.show = function(req, res) {
  Etablissement
    .findOne({human_id: req.params.id})
    .exec(function (err, etablissement) {
      if (err) { return handleError(req, res, err); }
      if(!etablissement) { return res.sendStatus(404); }

      return res.json(etablissement);
  });
};

exports.query = function(req, res) {
  Etablissement
    .find()
    .exec(function (err, etablissements) {
      if (err) { return handleError(req, res, err); }
      if(!etablissements) { return res.sendStatus(404); }

      return res.json(etablissements);
  });
};

exports.demandes = function(req, res) {
  Etablissement
    .find()
    .exec(function (err, etablissements) {
      if (err) { return handleError(req, res, err); }
      if(!etablissements) { return res.sendStatus(404); }

      return res.json(etablissements);
  });
};

exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Etablissement.findOne({
    human_id: req.params.id
  }, function (err, etablissement) {
    if (err) { return handleError(req, res, err); }
    if(!etablissement) { return res.sendStatus(404); }
    var updated = _.merge(etablissement, req.body);
    updated.save(function (err) {
      if (err) { return handleError(req, res, err); }
      return res.status(200).json(etablissement);
    });
  });
};

function handleError(req, res, err) {
  req.log.error(err);
  return res.status(500).send(err);
}
