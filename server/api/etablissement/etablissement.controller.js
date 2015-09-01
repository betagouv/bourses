'use strict';

var _ = require('lodash');
var mongoose = require('mongoose');

var Etablissement = require('./etablissement.model');
var Demande = require('../demande/demande.model');
var crypto = require('../../components/crypto/crypto');

exports.show = function(req, res) {
  Etablissement
    .findOne({human_id: req.params.id})
    .exec(function(err, etablissement) {
      if (err) { return handleError(req, res, err); }

      if (!etablissement) { return res.sendStatus(404); }

      return res.json(etablissement);
    });
};

exports.query = function(req, res) {
  Etablissement
    .find()
    .exec(function(err, etablissements) {
      if (err) { return handleError(req, res, err); }

      if (!etablissements) { return res.sendStatus(404); }

      return res.json(etablissements);
    });
};

function decode(demandes) {
  return _.map(demandes, crypto.decode);
}

exports.demandes = function(req, res) {
  Etablissement
    .findOne({human_id: req.params.id})
    .exec(function(err, etablissement) {
      if (err) { return handleError(req, res, err); }

      if (!etablissement) { return res.sendStatus(404); }

      var q;
      var limit;
      var offset;

      if (req.query.searchQuery) {
        var searchQuery = JSON.parse(req.query.searchQuery);
        q = searchQuery.q && _.isString(searchQuery.q) && searchQuery.q.length ? searchQuery.q : null;
        offset = parseInt(searchQuery.offset);
        offset = _.isNumber(offset) && offset > 0 ? Math.floor(offset) : 0;
      } else {
        q = null;
        offset = 0;
      }

      var query = {etablissement: etablissement, status: req.query.status};

      // Text search
      if (q) {
        query.$text = { $search: q, $language: 'french' };
      }

      Demande
        .find(query)
        .limit(25)
        .skip(offset)
        .exec(function(err, demandes) {
          if (err) { return handleError(req, res, err); }

          if (!demandes) { return res.sendStatus(404); }

          Demande.count(query).exec(function(err, count) {
            res.set('count', count);

            if (demandes) {
              return res.json(decode(demandes));
            } else {
              return res.json([]);
            }
          });
        });
    });
};

exports.update = function(req, res) {
  if (req.body._id) { delete req.body._id; }

  console.log(req.body);

  Etablissement.findOne({
    human_id: req.params.id
  }, function(err, etablissement) {
    if (err) { return handleError(req, res, err); }

    if (!etablissement) { return res.sendStatus(404); }

    var updated = _.merge(etablissement, req.body);
    updated.save(function(err) {
      if (err) { return handleError(req, res, err); }

      return res.status(200).json(etablissement);
    });
  });
};

function handleError(req, res, err) {
  req.log.error(err);
  return res.status(500).send(err);
}
