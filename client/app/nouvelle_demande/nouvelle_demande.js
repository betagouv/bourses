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
        controller: 'VosRessourcesCtrl'
      })
      .state('layout.nouvelle_demande.vos-renseignements', {
        url: '/vos-renseignements',
        templateUrl: 'app/nouvelle_demande/vos-renseignements/vos-renseignements.html',
        controller: 'VosRenseignementsCtrl'
      });
  });
