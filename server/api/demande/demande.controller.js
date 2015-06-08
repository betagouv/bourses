'use strict';

var _ = require('lodash');
var Demande = require('./demande.model');

// Creates a new demande in the DB.
exports.create = function(req, res) {
  var str = JSON.stringify(req.body);
  var encoded = new Buffer(str).toString('base64');

  Demande.create({
    data: encoded
  }, function(err, demande) {
    if (err) { return handleError(req, res, err); }
    return res.status(201).json(demande);
  });
};

exports.show = function(req, res) {
  Demande
    .findById(req.params.id)
    .exec(function (err, demande) {
    if (err) { return handleError(req, res, err); }
    if(!demande) { return res.sendStatus(404); }
    var decoded = new Buffer(demande.data, 'base64').toString();
    var json = JSON.parse(decoded);
    return res.json(json);
  });
};

function handleError(req, res, err) {
  req.log.error(err);
  return res.status(500).send(err);
}
