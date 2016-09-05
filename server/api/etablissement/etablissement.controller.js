'use strict';

var _ = require('lodash');
var mongoose = require('mongoose');
var async = require('async');
var wkhtmltopdf = require('wkhtmltopdf');
var tmp = require('tmp');
var archiver = require('archiver');
var request = require('superagent');

var config = require('../../config/environment');

var Etablissement = require('./etablissement.model');
var Demande = require('../demande/demande.model');
var crypto = require('../../components/crypto/crypto');
var duplicates = require('../../components/duplicates/duplicates');
var Generator = require('../../components/pdf/generator');

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

exports.wrongYear = function(req, res) {
  Etablissement
    .findOne({human_id: req.params.id})
    .exec(function(err, etablissement) {
      if (err) { return handleError(req, res, err); }

      if (!etablissement) { return res.sendStatus(404); }

      var query = {etablissement: etablissement, 'data.data.anneeImpots': {$ne: '2014'}};
      Demande
        .find(query)
        .exec(function(err, demandes) {
          var decoded = decode(demandes);
          return res.json(decoded);
        });
    });
};

exports.count = function(req, res) {
  Etablissement
    .findOne({human_id: req.params.id})
    .exec(function(err, etablissement) {
      if (err) { return handleError(req, res, err); }

      if (!etablissement) { return res.sendStatus(404); }

      // status: ... ['new', 'pending', 'pause', 'error', 'done'] ...
      async.parallel({
        new: function(callback) {
          Demande.count({
            etablissement: etablissement,
            status: {$in: ['new', 'pending']}
          }).exec(callback);
        },

        pause: function(callback) {
          Demande.count({
            etablissement: etablissement,
            status: 'pause'
          }).exec(callback);
        },

        error: function(callback) {
          Demande.count({
            etablissement: etablissement,
            status: 'error'
          }).exec(callback);
        },

        done: function(callback) {
          Demande.count({
            etablissement: etablissement,
            status: 'done'
          }).exec(callback);
        }

      }, function(err, result) {
        if (err) {
          return handleError(req, res, err);
        }

        return res.json(result);
      });
    });
};

exports.notifications = function(req, res) {
  Etablissement
    .findOne({human_id: req.params.id})
    .exec(function(err, etablissement) {
      if (err) { return handleError(req, res, err); }

      if (!etablissement) { return res.sendStatus(404); }

      var host = req.headers.host;
      async.waterfall([
        function(callback) {
          Demande
            .find({status: 'done', etablissement: etablissement._id})
            .sort('-createdAt')
            .exec(callback);
        },

        function(demandes, callback) {
          tmp.dir({unsafeCleanup: true}, function _tempDirCreated(err, path, cleanupCallback) {
            if (err) throw err;

            async.eachLimit(demandes, 8, function(demande, eachSeriesCallback) {
              var decoded = crypto.decode(demande);
              Generator.editNotification(decoded, etablissement, function(html) {
                var fileName = path + '/notification_' + decoded.identiteEnfant.prenom + '_' + decoded.identiteEnfant.nom + '.pdf';
                wkhtmltopdf(html, {encoding: 'UTF-8', output: fileName }, function() {
                  eachSeriesCallback();
                });
              });
            },

            function() {
              callback(null, path, cleanupCallback);
            });
          });
        }

      ], function(err, path, cleanupCallback) {
        var archive = archiver.create('zip', {});
        archive.directory(path, false);
        archive.pipe(res);
        archive.finalize();

        archive.on('finish', function(err) {
          cleanupCallback();
        });

        archive.on('error', function(err) {
          throw err;
        });

      });
    });
};

exports.listeDemandes = function(req, res) {
  Etablissement
    .findOne({human_id: req.params.id})
    .exec(function(err, etablissement) {
      if (err) { return handleError(req, res, err); }

      if (!etablissement) { return res.sendStatus(404); }

      var host = req.headers.host;
      async.waterfall([
        function(callback) {
          Demande
            .find({status: 'done', etablissement: etablissement._id})
            .sort('-createdAt')
            .exec(callback);
        },

        function(demandes, callback) {
          tmp.dir({unsafeCleanup: true}, function _tempDirCreated(err, path, cleanupCallback) {
            if (err) throw err;

            async.eachLimit(demandes, 8, function(demande, eachSeriesCallback) {
              var decoded = crypto.decode(demande);
              Generator.toHtml(decoded, etablissement, host, function(html) {
                var fileName = path + '/notification_' + decoded.identiteEnfant.prenom + '_' + decoded.identiteEnfant.nom + '.pdf';
                wkhtmltopdf(html, {encoding: 'UTF-8', output: fileName }, function() {
                  eachSeriesCallback();
                });
              });
            },

            function() {
              callback(null, path, cleanupCallback);
            });
          });
        }

      ], function(err, path, cleanupCallback) {
        var archive = archiver.create('zip', {});
        archive.directory(path, false);
        archive.pipe(res);
        archive.finalize();

        archive.on('finish', function(err) {
          cleanupCallback();
        });

        archive.on('error', function(err) {
          throw err;
        });

      });
    });
};

function toUpper(str, force) {
  if (force) {
    return str.toUpperCase();
  }

  return str && str.toLowerCase().replace(/\w\S*/g, function(txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

exports.listeRIBs = function(req, res) {
  Etablissement
    .findOne({human_id: req.params.id})
    .exec(function(err, etablissement) {
      if (err) { return handleError(req, res, err); }

      if (!etablissement) { return res.sendStatus(404); }

      var host = req.headers.host;
      Demande
        .find({status: 'done', 'notification.montant': {$ne: 0}, etablissement: etablissement._id})
        .sort('data.identiteAdulte.demandeur.nom')
        .exec(function(err, demandes) {

          demandes.forEach(function(demande) {
            demande.data.identiteAdulte.demandeur.prenoms = toUpper(demande.data.identiteAdulte.demandeur.prenoms);
            demande.data.identiteAdulte.demandeur.nom = toUpper(demande.data.identiteAdulte.demandeur.nom, true);

            demande.data.identiteEnfant.prenom = toUpper(demande.data.identiteEnfant.prenom);
            demande.data.identiteEnfant.nom = toUpper(demande.data.identiteEnfant.nom, true);

            demande.data.identiteAdulte.bic = toUpper(demande.data.identiteAdulte.bic, true);
          });

          var html = Generator.editRib(demandes, etablissement, host);
          wkhtmltopdf(html, {encoding: 'UTF-8', 'page-size': 'A4'}).pipe(res);
        });
    });
};

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
        limit = parseInt(searchQuery.limit);
        limit = _.isNumber(limit) ? limit : 10;
      } else {
        q = null;
        offset = 0;
        limit = null;
      }

      var query = {etablissement: etablissement};
      if (req.query.status) {
        var status = req.query.status === 'new' ?  ['new', 'pending'] : [req.query.status];
        query.status = {$in: status};
      }

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
                .limit(limit)
                .sort('-createdAt')
                .skip(offset)
                .exec(waterFallCallback);
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
        }

      }, function(err, result) {
        if (err) {
          return handleError(req, res, err);
        }

        if (result.demandes) {
          var decoded = decode(result.demandes);
          return res.json(decoded);
        } else {
          return res.json([]);
        }
      });
    });
};

exports.compta = function(req, res) {
  Etablissement
    .findOne({human_id: req.params.id})
    .exec(function(err, etablissement) {
      if (err) { return handleError(req, res, err); }

      if (!etablissement) { return res.sendStatus(404); }

      Demande
        .find({etablissement: etablissement, status: 'done', 'notification.montant': {$gt: 0}})
        .sort('data.identiteAdulte.demandeur.nom')
        .select('data.identiteAdulte notification')
        .exec(function(err, demandes) {
          if (err) { return handleError(req, res, err); }

          if (demandes && demandes.length > 0) {
            var decoded = decode(demandes);
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
