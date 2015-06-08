'use strict';

angular.module('boursesApp')
  .factory('DemandeService', function DemandeService($http) {
    return {
      save: function(demande) {
        return $http.post('/api/demandes', demande);
      },
      get: function(id) {
        return $http.get('/api/demandes/' + id);
      }
    };
  });
