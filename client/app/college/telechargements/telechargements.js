'use strict';

angular.module('boursesApp')
  .config(function($stateProvider) {
    $stateProvider
      .state('layout.college.telechargements', {
        url: '/telechargements',
        templateUrl: 'app/college/telechargements/telechargements.html',
        authenticate: true,
        resolve: {

        }
      });
  });
