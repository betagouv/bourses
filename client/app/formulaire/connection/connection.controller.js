'use strict';

angular.module('boursesApp')
  .controller('ConnectionCtrl', function($scope, $http, store) {
    $scope.credentials = store.get('credentials');

    $scope.submit = function(form) {
      store.set('credentials', $scope.credentials);

      if (form.$valid) {
        $http.get('/api/connection/svair', {params: $scope.credentials})
        .success(function(data) {
          console.log(data);
        })
        .error(function(err) {
          $scope.error = err.message;
        });
      }
    };
  });
