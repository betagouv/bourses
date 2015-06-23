'use strict';

angular.module('boursesApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('layout.demande', {
        url: '/demande/:id/:key',
        templateUrl: 'app/demande/demande.html',
        controller: 'DemandeCtrl',
        resolve: {
          id: function($stateParams) {
            return $stateParams.id;
          },
          key: function($stateParams) {
            return $stateParams.key;
          },
          demande: function($http, $state, id, key) {
            return $http.get('/api/demandes/' + id + '/' + key)
              .error(function() {
                $state.go('layout.formulaire.identite-enfant');
              })
              .then(function(result) {
                return result.data;
              });
          }
        }
      });
  });
