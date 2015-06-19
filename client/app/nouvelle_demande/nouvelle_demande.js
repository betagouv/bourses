'use strict';

angular.module('boursesApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('layout.nouvelle_demande', {
        url: 'nouvelle_demande',
        templateUrl: 'app/nouvelle_demande/form_layout.html',
        controller: 'FormLayoutCtrl',
        abstract: true
      })
      .state('layout.nouvelle_demande.identite-enfant', {
        url: '',
        templateUrl: 'app/nouvelle_demande/identite-enfant/identite-enfant.html',
        controller: 'IdentiteEnfantCtrl'
      })
      .state('layout.nouvelle_demande.vos-ressources', {
        url: '/vos-ressources?:login',
        templateUrl: 'app/nouvelle_demande/vos-ressources/vos-ressources.html',
        controller: 'VosRessourcesCtrl',
        resolve: {
          isLoggedIn: function(fc, svair) {
            return fc || svair;
          },
          svair: function(store) {
            return store.get('svair') || null;
          },
          fc: function($http) {
            return $http.get('/api/connection/fc').then(
              function(result) {
                return result;
              },
              function() {
                return null;
              });
          }
        }
      })
      .state('layout.nouvelle_demande.vos-renseignements', {
        url: '/vos-renseignements',
        templateUrl: 'app/nouvelle_demande/vos-renseignements/vos-renseignements.html',
        controller: 'VosRenseignementsCtrl'
      });
  });