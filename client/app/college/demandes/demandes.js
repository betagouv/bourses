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
      .state('layout.college.demandes.new', {
        url: '/nouvelles?recherche&currentPage&sortType&reverse',
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
          },

          sortType: function($stateParams) {
            return $stateParams.sortType || 'createdAt';
          },

          reverse: function($stateParams) {
            return $stateParams.reverse === 'true' || false;
          }
        }
      })
      .state('layout.college.demandes.paused', {
        url: '/en_attente?recherche&currentPage&sortType&reverse',
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
          },

          sortType: function($stateParams) {
            return $stateParams.sortType || 'createdAt';
          },

          reverse: function($stateParams) {
            return $stateParams.reverse === 'true' || false;
          }
        }
      })
      .state('layout.college.demandes.done', {
        url: '/traitees?recherche&currentPage&sortType&reverse',
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
          },

          sortType: function($stateParams) {
            return $stateParams.sortType || 'createdAt';
          },

          reverse: function($stateParams) {
            return $stateParams.reverse === 'true' || false;
          }
        }
      })
      .state('layout.college.demandes.error', {
        url: '/erreur?recherche&currentPage&sortType&reverse',
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
          },

          sortType: function($stateParams) {
            return $stateParams.sortType || 'createdAt';
          },

          reverse: function($stateParams) {
            return $stateParams.reverse === 'true' || false;
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
