'use strict';

angular.module('boursesApp')
  .config(function($stateProvider) {
    $stateProvider
      .state('layout.college.edit', {
        url: '/edit',
        templateUrl: 'app/college/edit/edit.html',
        authenticate: true,
        controller: 'EditCollegeCtrl',
        resolve: {
          groups: function($http, college) {
            return $http.get('/api/etablissements/' + college.human_id + '/demandes?status=done').then(function(result) {
              return _.groupBy(result.data, 'notification.montant');
            });
          },

          count: function(groups) {
            return _.map(groups, function(group) {
              return group.length;
            });
          }
        }
      });
  });
