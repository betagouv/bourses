'use strict';

angular.module('boursesApp')
  .controller('ConnectionCtrl', function($scope, $http, $state, store) {
    $scope.credentials = store.get('credentials');
    var steps = store.get('steps');

    $scope.submit = function(form) {
      $scope.btnText = 'En cours...';
      store.set('credentials', $scope.credentials);
      steps.connection = form.$valid;

      if (form.$valid) {
        store.set('steps', steps);
        $http.get('/api/connection/svair', {params: $scope.credentials})
        .success(function(data) {
          store.set('svair-data', data);
          $state.go('main.formulaire.modifications');
        })
        .error(function(err) {
          $scope.error = err.message;
        })
        .finally(function() {
          $scope.loading = false;
        });
      }
    };
  });
