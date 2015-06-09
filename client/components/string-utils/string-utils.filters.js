'use strict';

angular.module('boursesApp')
  .filter('sexe', function () {
    return function (input) {
      switch (input) {
        case 'feminin':
          return 'Fille';
        default:
          return 'Garçon';
      }
    };
  })
  .filter('regime', function () {
    return function (input) {
      switch (input) {
        case 'externe':
          return 'Externe';
        case 'interne':
          return 'Interne';
        default:
          return 'Demi-pensionnaire';
      }
    };
  })
  .filter('lien', function () {
    return function (input) {
      switch (input) {
        case 'pere':
          return 'Père';
        case 'mere':
          return 'Mère';
        default:
          return 'Responsable légal';
      }
    };
  });
