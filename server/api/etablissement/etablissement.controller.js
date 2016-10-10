'use strict';

var _ = require('lodash');
var mongoose = require('mongoose');
var async = require('async');
var wkhtmltopdf = require('wkhtmltopdf');
var tmp = require('tmp');
var archiver = require('archiver');
var request = require('superagent');
var iconv = require('iconv-lite');

var config = require('../../config/environment');

var Etablissement = require('./etablissement.model');
var User = require('../user/user.model');
var Demande = require('../demande/demande.model');
var crypto = require('../../components/crypto/crypto');
var duplicates = require('../../components/duplicates/duplicates');
var GeneratorPdf = require('../../components/generators/pdf/pdf');
var GeneratorCsv = require('../../components/generators/csv/csv');

function validationError(res, statusCode) {
  statusCode = statusCode || 422;
  return function(err) {
    return res.status(statusCode).json(err);
  };
}

exports.show = function(req, res) {
  return res.json(req.etablissement);
};

exports.showById = function(req, res) {
  return res.json(req.etablissement);
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
  var query = {etablissement: req.etablissement, 'data.data.anneeImpots': {$ne: '2014'}};

  Demande
    .find(query)
    .exec(function(err, demandes) {
      var decoded = decode(demandes);
      return res.json(decoded);
    });
};

exports.count = function(req, res) {
  // status: ... ['new', 'pending', 'pause', 'error', 'done'] ...
  async.parallel({
    new: function(callback) {
      Demande.count({
        etablissement: req.etablissement,
        status: {$in: ['new', 'pending']}
      }).exec(callback);
    },

    pause: function(callback) {
      Demande.count({
        etablissement: req.etablissement,
        status: 'pause'
      }).exec(callback);
    },

    error: function(callback) {
      Demande.count({
        etablissement: req.etablissement,
        status: 'error'
      }).exec(callback);
    },

    done: function(callback) {
      Demande.count({
        etablissement: req.etablissement,
        status: 'done'
      }).exec(callback);
    }

  }, function(err, result) {
    if (err) {
      return handleError(req, res, err);
    }

    return res.json(result);
  });
};

function createPdfArchive(req, res, type) {
  Demande
    .find({status: 'done', etablissement: req.etablissement._id})
    .sort('-createdAt')
    .exec(function(err, demandes) {
      if (err) { return handleError(req, res, err); }

      GeneratorPdf.createPdfArchive(demandes, req.etablissement, req.hostname, {type: type}, function(err, archive, cleanupCallback) {
        if (err) { return handleError(req, res, err); }

        archive.on('finish', function(err) {
          cleanupCallback();
        });

        archive.on('error', function(err) {
          res.status(500).send({error: err.message});
        });

        archive.on('end', function() {
          console.log('Archive wrote %d bytes', archive.pointer());
        });

        archive.on('error', function(err) {
          throw err;
        });

        archive.pipe(res);
        archive.finalize();
      });
    });
}

exports.notifications = function(req, res) {
  return createPdfArchive(req, res, 'notification');
};

exports.listeDemandes = function(req, res) {
  if (req.query.csv) {
    Demande
      .find({etablissement: req.etablissement._id})
      .sort('data.identiteEnfant.nom')
      .exec(function(err, demandes) {
        if (err) { return handleError(req, res, err); }

        GeneratorCsv.generate(demandes, req.etablissement, function(err, csv) {
          if (err) { return handleError(req, res, err); }

          var buffer = iconv.encode(csv, 'utf16le');

          res.writeHead(200, {
            'Content-Type': 'text/csv; charset=utf-16le; header=present;'
          });

          res.write(new Buffer([0xff, 0xfe]));
          res.write(buffer);
          return res.end();
        });
      });
  } else {
    return createPdfArchive(req, res, 'demande');
  }
};

exports.listeRIBs = function(req, res) {
  var host = req.headers.host;
  Demande
    .find({status: 'done', 'notification.montant': {$ne: 0}, etablissement: req.etablissement._id})
    .sort('data.identiteAdulte.demandeur.nom')
    .exec(function(err, demandes) {
      var html = GeneratorPdf.editRib(demandes, req.etablissement, host);
      wkhtmltopdf(html, {encoding: 'UTF-8', 'page-size': 'A4'}).pipe(res);
    });
};

exports.aideSiecle = function(req, res) {
  var host = req.headers.host;
  Demande
    .find({etablissement: req.etablissement._id})
    .sort('data.identiteAdulte.demandeur.nom')
    .exec(function(err, demandes) {
      var html = GeneratorPdf.editSiecle(demandes, req.etablissement, host);
      wkhtmltopdf(html, {encoding: 'UTF-8', 'page-size': 'A4'}).pipe(res);
    });
};

function getCorrespondingExpression(sortType) {
  switch (sortType) {
    case 'enfant':
      return 'data.identiteEnfant.nom';
    case 'adulte':
      return 'data.identiteAdulte.demandeur.nom';
    case 'email':
      return 'data.identiteAdulte.email';
    case 'taux':
      return 'notification.montant';
    default:
      return sortType;
  }
}

exports.demandes = function(req, res) {
  var q;
  var limit;
  var offset;
  var sort;

  if (req.query.searchQuery) {
    var searchQuery = JSON.parse(req.query.searchQuery);
    q = searchQuery.q && _.isString(searchQuery.q) && searchQuery.q.length ? searchQuery.q : null;
    offset = parseInt(searchQuery.offset);
    offset = _.isNumber(offset) && offset > 0 ? Math.floor(offset) : 0;
    limit = parseInt(searchQuery.limit);
    limit = _.isNumber(limit) ? limit : 10;

    var reverse = searchQuery.reverse || false;
    var sortQuery = searchQuery.sort || 'createdAt';
    var sortExpression = getCorrespondingExpression(sortQuery);
    sort = {[sortExpression]: reverse ? -1 : 1};
  } else {
    q = null;
    offset = 0;
    limit = null;
    sort = '-createdAt';
  }

  var query = {etablissement: req.etablissement};
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
            .sort(sort)
            .skip(offset)
            .exec(waterFallCallback);
        },

        function(demandes, waterFallCallback) {
          duplicates.findDuplicates(demandes, req.etablissement, waterFallCallback);
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
};

exports.compta = function(req, res) {
  Demande
    .find({etablissement: req.etablissement, status: 'done', 'notification.montant': {$gt: 0}})
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
};

exports.update = function(req, res) {
  if (req.body._id) { delete req.body._id; }

  var updated = _.merge(req.etablissement, req.body);
  updated.save(function(err) {
    if (err) { return handleError(req, res, err); }

    return res.status(200).json(req.etablissement);
  });
};

exports.changePassword = function(req, res) {
  var userId = req.user._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  return User.findById(userId).select('+salt +hashedPassword').exec()
    .then(user => {
      if (user.authenticate(oldPass)) {
        user.password = newPass;
        return user.save()
          .then(() => {
            res.status(204).end();
          })
          .catch(validationError(res));
      } else {
        return res.status(403).end();
      }
    });
};

function handleError(req, res, err) {
  req.log.error(err);
  return res.status(500).send(err);
}
