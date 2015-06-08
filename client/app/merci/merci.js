'use strict';

angular.module('boursesApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('main.merci', {
        url: 'merci',
        templateUrl: 'app/merci/merci.html'
      });
  });
