'use strict';

/* jshint multistr: true */

var _ = require('lodash');
var os = require('os');
var fs = require('fs');
var path = require('path');
var async = require('async');
var moment = require('moment');
var mustache = require('mustache');

function readFile(name, callback) {
  fs.readFile(path.join(__dirname, name), function(err, html) {
    callback(err, String(html));
  });
}

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

exports.toHtml = function(demande, path, done) {
  async.series({
    template: function(callback) {
      readFile('template.html', callback);
    },

    formattedAnswers: function(callback) {
      var formatted = _.cloneDeep(demande);

      var createdAt = new Date(demande.createdAt);
      formatted.createdAt = moment(createdAt).format('DD/MM/YYYY à HH:MM');
      formatted.identiteEnfant.sexe = formatSexe(demande.identiteEnfant.sexe);
      formatted.identiteEnfant.dateNaissance = formatDate(demande.identiteEnfant.dateNaissance);
      formatted.identiteEnfant.regime = formatRegime(demande.identiteEnfant.regime);
      formatted.identiteAdulte.lien = formatLien(demande.identiteAdulte.lien);

      formatted.path = path;
      callback(null, formatted);
    }
  },
  function(err, results) {
    var html = mustache.render(results.template, results.formattedAnswers);
    done(html);
  });
};

exports.editNotification = function(demande, done) {
  async.series({
    template: function(callback) {
      readFile('notification.html', callback);
    },

    answers: function(callback) {
      var formatted = _.cloneDeep(demande);
      callback(null, formatted);
    }
  },
  function(err, results) {
    var html = mustache.render(results.template, results.answers);
    done(html);
  });
};
