'use strict';

angular.module('boursesApp')
  .config(function($stateProvider) {
    $stateProvider
      .state('layout.college.campaign', {
        url: '/campagne',
        templateUrl: 'app/college/campaign/campaign.html',
        authenticate: true,
        controller: 'CampaignCollegeCtrl',
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
