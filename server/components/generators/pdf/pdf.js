'use strict';

/* jshint multistr: true */

var _ = require('lodash');
var fs = require('fs');
var tmp = require('tmp');
var path = require('path');
var async = require('async');
var moment = require('moment');
var archiver = require('archiver');
var mustache = require('mustache');
var wkhtmltopdf = require('wkhtmltopdf');
var formatters = require('../utils/formatters');
var crypto = require('../../../components/crypto/crypto');

var templateNotification = String(fs.readFileSync(path.join(__dirname, 'notification.html')));
var templateRib = String(fs.readFileSync(path.join(__dirname, 'rib.html')));
var templateSiecle = String(fs.readFileSync(path.join(__dirname, 'siecle.html')));
var templateRefus = String(fs.readFileSync(path.join(__dirname, 'refus.html')));
var template = String(fs.readFileSync(path.join(__dirname, 'template.html')));

function toUpper(str, force) {
  if (force) {
    return str.toUpperCase();
  }

  return str && str.toLowerCase().replace(/\w\S*/g, function(txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

function toHtml(demande, college, _path, done) {
  async.series({
    template: function(callback) {
      callback(null, template);
    },

    formattedAnswers: function(callback) {
      var formatted = _.cloneDeep(demande);

      formatted.createdAt = formatters.formatCreatedAt(demande.createdAt);
      formatted.identiteEnfant.dateNaissance = formatters.formatDate(demande.identiteEnfant.dateNaissance);
      formatted.identiteEnfant.regime = formatters.formatRegime(demande.identiteEnfant.regime);
      formatted.identiteAdulte.lien = formatters.formatLien(demande.identiteAdulte.lien);

      formatted.rfr = demande.rfr;
      formatted.college = college;
      formatted.path = _path;
      callback(null, formatted);
    }
  },
  function(err, results) {
    var html = mustache.render(results.template, results.formattedAnswers);
    done(html);
  });
}

exports.toHtml = toHtml;

function editNotification(demande, college, done) {
  async.series({
    template: function(callback) {
      if (demande.notification.montant === 0) {
        callback(null, templateRefus);
      } else {
        demande.notification.montantAnnuel = demande.notification.montant * 3;
        callback(null, templateNotification);
      }
    },

    answers: function(callback) {
      var formatted = _.cloneDeep(demande);

      formatted.college = college;
      formatted.date = moment().format('DD/MM/YYYY');

      callback(null, formatted);
    }
  },
  function(err, results) {
    var html = mustache.render(results.template, results.answers);
    done(html);
  });
}

exports.editNotification = editNotification;

exports.editSiecle = function(demandes, college) {
  demandes.forEach(function(demande) {
    demande.data.identiteAdulte.demandeur.prenoms = toUpper(demande.data.identiteAdulte.demandeur.prenoms);
    demande.data.identiteAdulte.demandeur.nom = toUpper(demande.data.identiteAdulte.demandeur.nom, true);

    demande.data.identiteEnfant.prenom = toUpper(demande.data.identiteEnfant.prenom);
    demande.data.identiteEnfant.nom = toUpper(demande.data.identiteEnfant.nom, true);
    demande.status = formatters.formatStatus(demande.status);

    demande.montant = formatters.formatMontant(demande.notification.montant);

    demande.nombrePersonnesAcharge = demande.data.foyer.nombreEnfantsACharge + demande.data.foyer.nombreEnfantsAdultes;
    demande.deductibilite = formatters.formatDeductibilie(demande.data.identiteEnfant.regime);
  });

  return mustache.render(templateSiecle, {demandes: demandes, college: college});
};

function editRib(demandes, college, host) {

  demandes.forEach(function(demande) {
    demande.data.identiteAdulte.demandeur.prenoms = toUpper(demande.data.identiteAdulte.demandeur.prenoms);
    demande.data.identiteAdulte.demandeur.nom = toUpper(demande.data.identiteAdulte.demandeur.nom, true);

    demande.data.identiteEnfant.prenom = toUpper(demande.data.identiteEnfant.prenom);
    demande.data.identiteEnfant.nom = toUpper(demande.data.identiteEnfant.nom, true);

    demande.data.identiteAdulte.bic = toUpper(demande.data.identiteAdulte.bic, true);
  });

  return mustache.render(templateRib, {demandes: demandes, college: college, host: host});
}

exports.editRib = editRib;

function createDemandeFile(demande, etablissement, host, tempPath, callback) {
  var decoded = crypto.decode(demande);
  toHtml(decoded, etablissement, host, function(html) {
    var fileName = tempPath + '/' + decoded.identiteEnfant.nom + '_' + decoded.identiteEnfant.prenom + '_demande.pdf';
    wkhtmltopdf(html, {encoding: 'UTF-8', 'page-size': 'A4', output: fileName }, function() {
      callback();
    });
  });
}

function createRibFile(demandes, etablissement, tempPath, host, callback) {
  var html = editRib(demandes, etablissement, host);
  var fileName = tempPath + '/__liste_ribs.pdf';
  wkhtmltopdf(html, {encoding: 'UTF-8', 'page-size': 'A4', output: fileName }, function() {
    callback();
  });
}

function createNotificationFile(demande, etablissement, tempPath, callback) {
  var decoded = crypto.decode(demande);
  editNotification(decoded, etablissement, function(html) {
    var fileName = tempPath + '/' + decoded.identiteEnfant.nom + '_' + decoded.identiteEnfant.prenom + '_notification.pdf';
    wkhtmltopdf(html, {encoding: 'UTF-8', 'page-size': 'A4', output: fileName }, function() {
      callback();
    });
  });
}

exports.createPdfArchive = function(demandes, etablissement, host, options, callback) {
  tmp.dir({unsafeCleanup: true}, function _tempDirCreated(err, tempPath, cleanupCallback) {
    if (err) {
      return callback(err);
    }

    createRibFile(demandes, etablissement, tempPath, host, function() {
      async.eachLimit(demandes, 8, function(demande, eachSeriesCallback) {
        if (options.type === 'campagne') {
          createNotificationFile(demande, etablissement, tempPath, function () {
            createDemandeFile(demande, etablissement, host, tempPath, eachSeriesCallback);
          });
        } else if (options.type === 'notification') {
          createNotificationFile(demande, etablissement, tempPath, eachSeriesCallback);
        } else {
          createDemandeFile(demande, etablissement, host, tempPath, eachSeriesCallback);
        }
      },

      function createArchive() {
        var archive = archiver.create('zip', {});

        archive.directory(tempPath, false);

        callback(null, archive, cleanupCallback);
      });
    });
  });
};
