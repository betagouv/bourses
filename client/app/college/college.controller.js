'use strict';

angular.module('boursesApp')
  .controller('CollegeAbstractCtrl', function($scope, $http, $state, Auth, store, college, count) {
    $scope.count = count;
    $scope.college = college;
    $scope.token = Auth.getToken();
    $scope.$state = $state;

    $scope.hideHelpCampaign = store.get('hideHelpCampaign');

    $scope.hideHelp = function() {
      $scope.hideHelpCampaign = true;
      store.set('hideHelpCampaign', $scope.hideHelpCampaign);
    };

    function updateCount() {
      return $http({method: 'GET', url: '/api/etablissements/' + college.human_id + '/count'}).then(function(result) {
        $scope.count = result.data;
      });
    }

    $scope.$on('updateCount', updateCount);

    $scope.logout = function() {
      Auth.logout();
      $state.go('login');
    };
  });
