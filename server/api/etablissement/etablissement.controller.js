'use strict';

var _ = require('lodash');
var mongoose = require('mongoose');
var async = require('async');
var svair = require('svair-api');

var Etablissement = require('./etablissement.model');
var Demande = require('../demande/demande.model');
var crypto = require('../../components/crypto/crypto');
var duplicates = require('../../components/duplicates/duplicates');

exports.show = function(req, res) {
  Etablissement
    .findOne({human_id: req.params.id})
    .exec(function(err, etablissement) {
      if (err) { return handleError(req, res, err); }

      if (!etablissement) { return res.sendStatus(404); }

      return res.json(etablissement);
    });
};

exports.showById = function(req, res) {
  Etablissement
    .findById(req.params.id)
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

      var status = req.query.status === 'new' ?  ['new', 'pending'] : [req.query.status];
      var query = {etablissement: etablissement, status: {$in: status}};

      // Text search
      if (q) {
        query.$text = { $search: q, $language: 'french' };
      }

      async.parallel({
        demandes: function(callback) {
          async.waterfall([
            function(waterFallCallback) {
              Demande
                .find(query)
                .limit(10)
                .sort('-createdAt')
                .skip(offset)
                .exec(waterFallCallback);
            },

            function(demandes, waterFallCallback) {
              async.each(demandes, function(demande, eachSeriesCallback) {
                var data = demande.data.data;
                if (!data.anneeImpots) {
                  svair(data.credentials.numeroFiscal, data.credentials.referenceAvis, function(err, result) {
                    demande
                      .set('data.data.anneeRevenus', result.anneeRevenus)
                      .set('data.data.anneeImpots', result.anneeImpots)
                      .save(function() {
                        eachSeriesCallback();
                      });
                  });
                } else {
                  eachSeriesCallback();
                }
              },

              function() {
                waterFallCallback(null, demandes);
              });
            },

            function(demandes, waterFallCallback) {
              duplicates.findDuplicates(demandes, etablissement, waterFallCallback);
            },

            function(demandes, duplicates, waterFallCallback) {
              demandes.forEach(function(demande) {
                demande.isDuplicate = duplicates.indexOf(demande.id) > -1;
              });

              waterFallCallback(null, demandes);
            }

          ], function(err, demandes) {
            callback(err, demandes);
          });
        },

        count: function(callback) {
          Demande.count(query).exec(callback);
        },

      }, function(err, result) {
        if (err) {
          return handleError(req, res, err);
        }

        if (result.demandes) {
          res.set('count', result.count);
          var decoded = decode(result.demandes);
          return res.json(decoded);
        } else {
          return res.json([]);
        }
      });
    });
};

exports.update = function(req, res) {
  if (req.body._id) { delete req.body._id; }

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
