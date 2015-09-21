'use strict';

angular.module('boursesApp')
  .config(function($stateProvider) {
    $stateProvider
      .state('layout.college', {
        url: '/college/:id',
        templateUrl: 'app/college/college.html',
        authenticate: true,
        controller: 'CollegeAbstractCtrl',
        resolve: {
          id: function($stateParams) {
            return $stateParams.id;
          },

          college: function(Etablissement, id) {
            return Etablissement.get({id: id}).$promise;
          },

          count: function($http, college) {
            return $http({method: 'GET', url: '/api/etablissements/' + college.human_id + '/count'}).then(function(result) {
              return result.data;
            });
          },
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
        url: '/nouvelles?recherche&currentPage',
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

          currentPage: function($stateParams) {
            return $stateParams.currentPage || null;
          }
        }
      })
      .state('layout.college.demandes.paused', {
        url: '/en_attente?recherche&currentPage',
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

          currentPage: function($stateParams) {
            return $stateParams.currentPage || null;
          }
        }
      })
      .state('layout.college.demandes.done', {
        url: '/traitees?recherche&currentPage',
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

          currentPage: function($stateParams) {
            return $stateParams.currentPage || null;
          }
        }
      })
      .state('layout.college.demandes.error', {
        url: '/erreur?recherche&currentPage',
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

          currentPage: function($stateParams) {
            return $stateParams.currentPage || null;
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
