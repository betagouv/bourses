'use strict';

angular.module('boursesApp')
  .config(function($stateProvider) {
    $stateProvider
      .state('layout.college', {
        url: '/college/:id',
        templateUrl: 'app/college/college.html',
        controller: function($scope, $http, $state, Auth, college) {
          $scope.college = college;

          $scope.new = 0;
          $http({method: 'HEAD', url: '/api/etablissements/' + college.human_id + '/demandes?status=new'}).then(function(result) {
            $scope.new = result.headers('count');
          });

          $scope.pending = 0;
          $http({method: 'HEAD', url: '/api/etablissements/' + college.human_id + '/demandes?status=pending'}).then(function(result) {
            $scope.pending = result.headers('count');
          });

          $scope.done = 0;
          $http({method: 'HEAD', url: '/api/etablissements/' + college.human_id + '/demandes?status=done'}).then(function(result) {
            $scope.done = result.headers('count');
          });

          $scope.logout = function() {
            Auth.logout();
            $state.go('layout.login');
          };
        },

        resolve: {
          id: function($stateParams) {
            return $stateParams.id;
          },

          college: function(Etablissement, id) {
            return Etablissement.get({id: id}).$promise;
          }
        },
        abstract: true
      })
      .state('layout.college.demandes', {
        url: '/demandes',
        template: '<ui-view></ui-view>',
        authenticate: true,
        abstract: true
      })
      .state('layout.college.demandes.new', {
        url: '/nouvelles',
        templateUrl: 'app/college/demandes/liste.html',
        authenticate: true,
        controller: 'DemandeListCtrl',
        resolve: {
          status: function() {
            return 'new';
          }
        }
      })
      .state('layout.college.demandes.pending', {
        url: '/en_cours',
        templateUrl: 'app/college/demandes/liste.html',
        authenticate: true,
        controller: 'DemandeListCtrl',
        resolve: {
          status: function() {
            return 'pending';
          }
        }
      })
      .state('layout.college.demandes.done', {
        url: '/traitees',
        templateUrl: 'app/college/demandes/liste.html',
        authenticate: true,
        controller: 'DemandeListCtrl',
        resolve: {
          status: function() {
            return 'done';
          }
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
        templateUrl: 'app/college/edit/edit.html',
        authenticate: true,
        controller: 'EditCollegeCtrl'
      });
  });
