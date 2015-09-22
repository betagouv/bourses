'use strict';

angular.module('boursesApp')
  .config(function($stateProvider) {
    $stateProvider
      .state('layout.modification', {
        url: '/modification?token',
        templateUrl: '/app/modification/modification.html',
        resolve: {
          demande: function($stateParams, $http) {
            return $http.get('/api/demandes/modification?token=' + $stateParams.token).then(function(result) {
              return result.data;
            });
          }
        },
        controller: 'ModificationCtrl'
      });
  });
