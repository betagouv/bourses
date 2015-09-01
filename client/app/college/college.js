'use strict';

angular.module('boursesApp')
  .config(function($stateProvider) {
    $stateProvider
      .state('layout.college', {
        url: '/college/:id',
        templateUrl: 'app/college/college.html',
        controller: function($scope, $http, $state, Auth, college, newRequests, pendingRequests, doneRequests) {
          $scope.college = college;
          $scope.new = newRequests;
          $scope.pending = pendingRequests;
          $scope.done = doneRequests;

          function updateCount(status) {
            return $http({method: 'HEAD', url: '/api/etablissements/' + college.human_id + '/demandes?status=' + status}).then(function(result) {
              $scope[status] = result.headers('count');
            });
          }

          $scope.$on('updateCount', function() {
            updateCount('new');
            updateCount('pending');
            updateCount('done');
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
          },

          newRequests: function($http, college) {
            return $http({method: 'HEAD', url: '/api/etablissements/' + college.human_id + '/demandes?status=new'}).then(function(result) {
              return result.headers('count');
            });
          },

          pendingRequests: function($http, college) {
            return $http({method: 'HEAD', url: '/api/etablissements/' + college.human_id + '/demandes?status=pending'}).then(function(result) {
              return result.headers('count');
            });
          },

          doneRequests: function($http, college) {
            return $http({method: 'HEAD', url: '/api/etablissements/' + college.human_id + '/demandes?status=done'}).then(function(result) {
              return result.headers('count');
            });
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
        url: '/nouvelles?recherche?page',
        templateUrl: 'app/college/demandes/liste.html',
        authenticate: true,
        controller: 'DemandeListCtrl',
        resolve: {
          status: function() {
            return 'new';
          },

          recherche: function($stateParams) {
            return $stateParams.recherche || null;
          },

          page: function($stateParams) {
            return $stateParams.page || null;
          }
        }
      })
      .state('layout.college.demandes.pending', {
        url: '/en_cours?recherche?page',
        templateUrl: 'app/college/demandes/liste.html',
        authenticate: true,
        controller: 'DemandeListCtrl',
        resolve: {
          status: function() {
            return 'pending';
          },

          recherche: function($stateParams) {
            return $stateParams.recherche || null;
          },

          page: function($stateParams) {
            return $stateParams.page || null;
          }
        }
      })
      .state('layout.college.demandes.done', {
        url: '/traitees?recherche?page',
        templateUrl: 'app/college/demandes/liste.html',
        authenticate: true,
        controller: 'DemandeListCtrl',
        resolve: {
          status: function() {
            return 'done';
          },

          recherche: function($stateParams) {
            return $stateParams.recherche || null;
          },

          page: function($stateParams) {
            return $stateParams.page || null;
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
