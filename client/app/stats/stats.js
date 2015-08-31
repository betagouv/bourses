'use strict';

angular.module('boursesApp')
  .config(function($stateProvider) {
    $stateProvider
      .state('layout.stats', {
        url: '/stats',
        templateUrl: 'app/stats/stats.html',
        controller: 'StatsCtrl'
      });
  });
