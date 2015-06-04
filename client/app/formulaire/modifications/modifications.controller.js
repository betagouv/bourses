'use strict';

angular.module('boursesApp')
  .controller('ModificationsCtrl', function($scope, $http, $state, store) {
    $scope.data = store.get('svair-data');

    $scope.submit = function() {
      // TODO
    };
  });
