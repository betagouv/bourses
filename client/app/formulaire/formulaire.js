'use strict';

angular.module('boursesApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('main.formulaire', {
        url: '',
        templateUrl: 'app/formulaire/layout.html',
        controller: function() {},
        abstract: true
      })
      .state('main.formulaire.identite-enfant', {
        url: '',
        templateUrl: 'app/formulaire/identite-enfant/identite-enfant.html',
        controller: 'IdentiteEnfantCtrl'
      })
      .state('main.formulaire.connection', {
        url: '',
        templateUrl: 'app/formulaire/connection/connection.html',
        controller: 'ConnectionCtrl'
      })
      .state('main.formulaire.modifications', {
        url: '',
        templateUrl: 'app/formulaire/modifications/modifications.html',
        controller: function() {}
      });
  });
