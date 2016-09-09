'use strict';

angular.module('boursesApp').factory('Etablissement', function($resource) {
  return $resource('/api/etablissements/:id/:controller', {
    id: '@human_id'
  }, {
    update: {
      method:'PUT'
    },
    queryDemandes: {
      method: 'GET',
      params: {
        controller: 'demandes'
      },
      isArray: true
    },
    changePassword: {
      method: 'PUT',
      params: {
        controller: 'password'
      }
    }
  });
});
