'use strict';

/* jshint multistr: true */

var _ = require('lodash');
var os = require('os');
var fs = require('fs');
var path = require('path');
var async = require('async');
var moment = require('moment');
var mustache = require('mustache');

var templateNotification = String(fs.readFileSync(path.join(__dirname, 'notification.html')));
var templateRib = String(fs.readFileSync(path.join(__dirname, 'rib.html')));
var templateRefus = String(fs.readFileSync(path.join(__dirname, 'refus.html')));
var template = String(fs.readFileSync(path.join(__dirname, 'template.html')));

function formatDate(date) {
  return moment(date, moment.ISO_8601).format('DD/MM/YYYY');
}

function formatSexe(input) {
  switch (input) {
    case 'feminin':
      return 'Fille';
    default:
      return 'Garçon';
  }
}

function formatRegime(input) {
  switch (input) {
    case 'externe':
      return 'Externe';
    case 'interne':
      return 'Interne';
    default:
      return 'Demi-pensionnaire';
  }
}

function formatLien(input) {
  switch (input) {
    case 'pere':
      return 'Père';
    case 'mere':
      return 'Mère';
    default:
      return 'Responsable légal';
  }
}

exports.toHtml = function(demande, college, path, done) {
  async.series({
    template: function(callback) {
      callback(null, template);
    },

    formattedAnswers: function(callback) {
      var formatted = _.cloneDeep(demande);

      var createdAt = new Date(demande.createdAt);
      formatted.createdAt = moment(createdAt).format('DD/MM/YYYY à HH:MM');
      formatted.identiteEnfant.sexe = formatSexe(demande.identiteEnfant.sexe);
      formatted.identiteEnfant.dateNaissance = formatDate(demande.identiteEnfant.dateNaissance);
      formatted.identiteEnfant.regime = formatRegime(demande.identiteEnfant.regime);
      formatted.identiteAdulte.lien = formatLien(demande.identiteAdulte.lien);

      formatted.rfr = demande.rfr
      formatted.college = college;
      formatted.path = path;
      callback(null, formatted);
    }
  },
  function(err, results) {
    var html = mustache.render(results.template, results.formattedAnswers);
    done(html);
  });
};

exports.editNotification = function(demande, college, done) {
  async.series({
    template: function(callback) {
      if (demande.notification.montant === 0) {
        callback(null, templateRefus);
      } else {
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
};

exports.editRib = function(demandes, college, host) {
  return mustache.render(templateRib, {demandes: demandes, college: college, host: host});
};
