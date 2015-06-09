'use strict';

angular.module('boursesApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('main.formulaire', {
        url: '',
        templateUrl: 'app/formulaire/layout.html',
        controller: 'LayoutCtrl',
        abstract: true
      })
      .state('main.formulaire.identite-enfant', {
        url: '',
        templateUrl: 'app/formulaire/identite-enfant/identite-enfant.html',
        controller: 'IdentiteEnfantCtrl'
      })
      .state('main.formulaire.vos-ressources', {
        url: 'vos-ressources',
        templateUrl: 'app/formulaire/vos-ressources/vos-ressources.html',
        controller: 'VosRessourcesCtrl'
      })
      .state('main.formulaire.vos-renseignements', {
        url: 'vos-renseignements',
        templateUrl: 'app/formulaire/vos-renseignements/vos-renseignements.html',
        controller: 'VosRenseignementsCtrl'
      });
  });
