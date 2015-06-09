'use strict';

angular.module('boursesApp')
  .controller('ConnexionCtrl', function($scope, $http, $state, $timeout, store) {
    $scope.credentials = store.get('credentials');
    var steps = store.get('steps');
    $scope.submit = function(form) {
      $scope.loading = true;
      store.set('credentials', $scope.credentials);

      if (form.$valid) {
        $http.get('/api/connection/svair', {params: $scope.credentials})
        .success(function(data) {
          store.set('svair-data', data);
        })
        .error(function(err) {
          $scope.error = err.message;
        })
        .finally(function() {
          steps.connexion = form.$valid;
          store.set('steps', steps);

          $timeout(function() {
            $scope.loading = false;
            $state.go('main.formulaire.modifications');
          }, 600);
        });
      }
    };
  });
