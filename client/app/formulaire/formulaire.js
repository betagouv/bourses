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
      .state('main.formulaire.connexion', {
        url: 'connexion',
        templateUrl: 'app/formulaire/connexion/connexion.html',
        controller: 'ConnexionCtrl'
      })
      .state('main.formulaire.modifications', {
        url: 'modifications',
        templateUrl: 'app/formulaire/modifications/modifications.html',
        controller: 'ModificationsCtrl'
      });
  });
