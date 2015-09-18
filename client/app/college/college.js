'use strict';

angular.module('boursesApp')
  .config(function($stateProvider) {
    $stateProvider
      .state('layout.college', {
        url: '/college/:id',
        templateUrl: 'app/college/college.html',
        authenticate: true,
        controller: function($scope, $http, $state, Auth, college, newRequests, pausedRequests, doneRequests, errorRequests) {
          $scope.college = college;
          $scope.new = newRequests;
          $scope.pause = pausedRequests;
          $scope.done = doneRequests;
          $scope.error = errorRequests;

          function updateCount(status) {
            return $http({method: 'HEAD', url: '/api/etablissements/' + college.human_id + '/demandes?status=' + status}).then(function(result) {
              $scope[status] = result.headers('count');
            });
          }

          $scope.$on('updateCount', function() {
            updateCount('new');
            updateCount('pause');
            updateCount('done');
            updateCount('error');
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

          pausedRequests: function($http, college) {
            return $http({method: 'HEAD', url: '/api/etablissements/' + college.human_id + '/demandes?status=pause'}).then(function(result) {
              return result.headers('count');
            });
          },

          doneRequests: function($http, college) {
            return $http({method: 'HEAD', url: '/api/etablissements/' + college.human_id + '/demandes?status=done'}).then(function(result) {
              return result.headers('count');
            });
          },

          errorRequests: function($http, college) {
            return $http({method: 'HEAD', url: '/api/etablissements/' + college.human_id + '/demandes?status=error'}).then(function(result) {
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
      .state('layout.college.demandes.paused', {
        url: '/en_attente?recherche?page',
        templateUrl: 'app/college/demandes/liste.html',
        authenticate: true,
        controller: 'DemandeListCtrl',
        resolve: {
          status: function() {
            return 'pause';
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
      .state('layout.college.demandes.error', {
        url: '/erreur?recherche?page',
        templateUrl: 'app/college/demandes/liste.html',
        authenticate: true,
        controller: 'DemandeListCtrl',
        resolve: {
          status: function() {
            return 'error';
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
        authenticate: true,
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
        controller: 'EditCollegeCtrl',
        resolve: {
          listeDemandes: function($http, college) {
            return $http.get('/api/etablissements/' + college.human_id + '/wrongYear').then(function(result) {
              return result.data;
            });
          }
        }
      });
  });
