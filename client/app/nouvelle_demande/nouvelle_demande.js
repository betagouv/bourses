'use strict';

angular.module('boursesApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('layout.nouvelle_demande', {
        url: '/nouvelle_demande?college',
        templateUrl: 'app/nouvelle_demande/form_layout.html',
        controller: 'FormLayoutCtrl',
        abstract: true,
        resolve: {
          college: function($stateParams) {
            if ($stateParams) {
              return $stateParams.college;
            }
            return null;
          }
        }
      })
      .state('layout.nouvelle_demande.identite-enfant', {
        url: '',
        templateUrl: 'app/nouvelle_demande/identite-enfant/identite-enfant.html',
        controller: 'IdentiteEnfantCtrl'
      })
      .state('layout.nouvelle_demande.vos-ressources', {
        url: '/vos-ressources',
        templateUrl: 'app/nouvelle_demande/vos-ressources/vos-ressources.html',
        controller: 'VosRessourcesCtrl'
      })
      .state('layout.nouvelle_demande.vos-renseignements', {
        url: '/vos-renseignements',
        templateUrl: 'app/nouvelle_demande/vos-renseignements/vos-renseignements.html',
        controller: 'VosRenseignementsCtrl'
      });
  });
