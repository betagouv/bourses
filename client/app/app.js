'use strict';

angular
  .module('boursesApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ui.router',
    'ui.bootstrap',
    'angular-storage',
    'ngMessages',
    'angular-ladda'
  ])
  .config(function ($urlRouterProvider, $locationProvider, $urlMatcherFactoryProvider) {
    moment.locale('fr');
    $urlRouterProvider.otherwise('/');
    $locationProvider.html5Mode(true);
    $urlMatcherFactoryProvider.strictMode(false);
  });
