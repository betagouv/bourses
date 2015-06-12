'use strict';

var _ = require('lodash');
var mongoose = require('mongoose');

var Etablissement = require('./etablissement.model');

exports.show = function(req, res) {
  var id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.sendStatus(400);
  }

  Etablissement
    .findById(id)
    .select('-contact')
    .exec(function (err, etablissement) {
      if (err) { return handleError(req, res, err); }
      if(!etablissement) { return res.sendStatus(404); }

      return res.json(etablissement);
  });
};

exports.query = function(req, res) {
  Etablissement
    .find()
    .select('-contact')
    .exec(function (err, etablissements) {
      if (err) { return handleError(req, res, err); }
      if(!etablissements) { return res.sendStatus(404); }

      return res.json(etablissements);
  });
};

function handleError(req, res, err) {
  req.log.error(err);
  return res.status(500).send(err);
}
