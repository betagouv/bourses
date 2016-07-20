'use strict';

angular.module('boursesApp')
  .filter('capitalize', function() {
    return function(input, each) {
      if (each) {
        return input.replace(/\w\S*/g, function(txt) {
          return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
      }

      return input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
    };
  })
  .filter('sexe', function() {
    return function(input) {
      switch (input) {
        case 'feminin':
          return 'Fille';
        default:
          return 'Garçon';
      }
    };
  })
  .filter('boolean', function() {
    return function(input) {
      if (input === true) {
        return 'Oui';
      } else if (typeof input !== 'undefined') {
        return 'Non';
      } else {
        return 'N/A';
      }
    };
  })
  .filter('regime', function() {
    return function(input) {
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
  .filter('deductibilite', function() {
    return function(input) {
      switch (input) {
        case 'externe':
          return 'Non';
        default:
          return 'Oui';
      }
    };
  })
  .filter('lien', function() {
    return function(input, lowercase) {
      switch (input) {
        case 'pere':
          return lowercase ? 'le père' : 'Père';
        case 'mere':
          return lowercase ? 'la mère' : 'Mère';
        default:
          return lowercase ? 'le responsable légal' : 'Responsable légal';
      }
    };
  })
  .filter('montant', function() {
    return function(input) {
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
  .filter('status', function() {
    return function(input) {
      switch (input) {
        case 'new':
          return 'Nouvelle demande';
        case 'pending':
          return 'En cours';
        case 'pause':
          return 'En attente';
        case 'error':
          return 'En erreur';
        case 'done':
          return 'Traitée';
      }
    };
  })
  .filter('descriptionMontant', function() {
    return function(input) {
      switch (input) {
        case null:
          return 'Résultat de votre simulation';
        case 0:
          return 'D\'après les informations saisies, votre enfant ne pourra pas bénéficier d\'une bourse de collège.';
        default:
          return 'D\'après les informations saisies, ' +
            'votre enfant pourra bénéficier d\'une bourse de collège d\'un montant annuel de:';
      }
    };
  });
