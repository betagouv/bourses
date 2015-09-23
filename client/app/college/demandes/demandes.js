'use strict';

angular.module('boursesApp')
  .config(function($stateProvider) {
    $stateProvider
      .state('layout.college.demandes', {
        url: '/demandes',
        template: '<ui-view></ui-view>',
        authenticate: true,
        abstract: true
      })
      .state('layout.college.demandes.create', {
        url: '/nouvelle_demande',
        templateUrl: 'app/college/demandes/create/create.html',
        authenticate: true,
        controller: 'DemandeCreateCtrl'
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
      });
  });
