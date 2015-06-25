'use strict';

angular.module('boursesApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('layout.college', {
        url: '/college/:id',
        templateUrl: 'app/college/college.html',
        resolve: {
          id: function($stateParams) {
            return $stateParams.id;
          }
        },
        abstract: true
      })
      .state('layout.college.demandes', {
        url: '/demandes',
        templateUrl: 'app/college/demandes/liste.html',
        authenticate: true,
        controller: function($scope, $state, Etablissement, id) {
          $scope.college = Etablissement.get({id: id});
          $scope.demandes = Etablissement.queryDemandes({id: id});
        }
      })
      .state('layout.college.demandes.edit', {
        url: '/:demandeId',
        templateUrl: 'app/college/demandes/edit.html',
        controller: 'DemandeEditCtrl',
        resolve: {
          demandeId: function($stateParams) {
            return $stateParams.demandeId;
          },
          demande: function($http, $state, demandeId) {
            return $http.get('/api/demandes/' + demandeId + '/random').then(function(result) {
              return result.data;
            });
          }
        }
      })
      .state('layout.college.edit', {
        url: '/edit',
        templateUrl: 'app/college/edit.html',
        authenticate: true,
        controller: function($scope, $state, Etablissement, id) {
          $scope.college = Etablissement.get({id: id});
          $scope.submit = function(form) {
            if (!form.$valid) {
              return;
            }

            $scope.college.$update(function() {
              $state.go('layout.admin');
            });
          }
        }
      });
  });
