'use strict';

angular.module('boursesApp').factory('getCorrespondingExpression', function() {
  return function(sortType) {
    switch (sortType) {
    case 'enfant':
      return 'identiteEnfant.nom';
    case 'adulte':
      return 'identiteAdulte.demandeur.nom';
    case 'email':
      return 'identiteAdulte.email';
    default:
      return sortType;
    }
  };
});
