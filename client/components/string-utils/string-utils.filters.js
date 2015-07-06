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
  .filter('deductibilite', function () {
    return function (input) {
      switch (input) {
        case 'externe':
          return 'Non';
        default:
          return 'Oui';
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
  })
  .filter('montant', function () {
    return function (input) {
      switch (input) {
        case null:
          return 'Pas de résultat';
        case 0:
          return 'Vous n\'avez pas droit à une bourse';
        default:
          return input + ' euros';
      }
    };
  })
  .filter('descriptionMontant', function () {
    return function (input) {
      switch (input) {
        case null:
          return 'Résultat de votre simulation';
        case 0:
          return 'D\'après les informations saisies , votre enfant ne pourra pas bénéficier d\'une bourse de collège.';
        default:
          return 'D\'après les informations saisies, ' +
            'votre enfant pourra bénéficier d\'une bourse de collège d\'un montant annuel de:';
      }
    };
  });
