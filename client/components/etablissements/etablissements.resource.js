'use strict';

angular.module('boursesApp').factory('Etablissement', function ($resource) {
  return $resource('/api/etablissements/:id', {
    id: '@_id'
  });
});
