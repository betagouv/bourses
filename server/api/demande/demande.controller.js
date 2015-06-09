'use strict';

var _ = require('lodash');
var mongoose = require('mongoose');
var wkhtmltopdf = require('wkhtmltopdf');

var Demande = require('./demande.model');
var Generator = require('../../components/pdf/generator');

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
  var id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.sendStatus(400);
  }

  Demande
    .findById(id)
    .exec(function (err, demande) {
    if (err) { return handleError(req, res, err); }
    if(!demande) { return res.sendStatus(404); }
    var decoded = new Buffer(demande.data, 'base64').toString();
    var demandeObj = JSON.parse(decoded);
    demandeObj.createdAt = demande.createdAt;
    return res.json(demandeObj);
  });
};

exports.download = function(req, res) {
  var id = req.params.id;
  var host = req.headers.host;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.sendStatus(400);
  }

  Demande
    .findById(id)
    .exec(function (err, demande) {
    if (err) { return handleError(req, res, err); }
    if(!demande) { return res.sendStatus(404); }
    var decoded = new Buffer(demande.data, 'base64').toString();
    var demandeObj = JSON.parse(decoded);
    demandeObj.createdAt = demande.createdAt;

    Generator.toHtml(demandeObj, host, function(html) {
      wkhtmltopdf(html, {encoding: 'UTF-8'}).pipe(res);
    });
  });

}

function handleError(req, res, err) {
  req.log.error(err);
  return res.status(500).send(err);
}
