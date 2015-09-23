'use strict';

angular.module('boursesApp')
  .config(function($stateProvider) {
    $stateProvider
      .state('layout.college', {
        url: '/college/:id',
        templateUrl: 'app/college/college.html',
        authenticate: true,
        controller: 'CollegeAbstractCtrl',
        resolve: {
          id: function($stateParams) {
            return $stateParams.id;
          },

          college: function(Etablissement, id) {
            return Etablissement.get({id: id}).$promise;
          },

          count: function($http, college) {
            return $http({method: 'GET', url: '/api/etablissements/' + college.human_id + '/count'}).then(function(result) {
              return result.data;
            });
          },
        },
        abstract: true
      })
      .state('layout.college.edit', {
        url: '/edit',
        templateUrl: 'app/college/edit/edit.html',
        authenticate: true,
        controller: 'EditCollegeCtrl',
        resolve: {
          listeDemandes: function($http, college) {
            return $http.get('/api/etablissements/' + college.human_id + '/wrongYear').then(function(result) {
              return result.data;
            });
          }
        }
      });
  });
