'use strict';

var moment = require('moment');

exports.formatDate = function(date) {
  return moment(date, moment.ISO_8601).format('DD/MM/YYYY');
};

exports.formatCreatedAt = function(createdAt) {
  return moment(new Date(createdAt)).format('DD/MM/YYYY à HH:MM');
};

exports.formatRegime = function(input) {
  switch (input) {
    case 'externe':
      return 'Externe';
    case 'interne':
      return 'Interne';
    default:
      return 'Demi-pensionnaire';
  }
};

exports.formatLien = function(input) {
  switch (input) {
    case 'pere':
      return 'Père';
    case 'mere':
      return 'Mère';
    default:
      return 'Responsable légal';
  }
};

exports.formatStatus = function(input) {
  switch(input) {
    case 'new':
    case 'pending':
      return 'Nouvelle demande';
    case 'pause':
      return 'En attente';
    case 'error':
      return 'En erreur';
    case 'done':
      return 'Traitée';
    default:
      return 'Inconnu';
  }
}
