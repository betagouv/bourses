'use strict';

angular.module('boursesApp')
  .controller('LayoutCtrl', function($scope, store) {
    if (store.get('steps') === null) {
      store.set('steps', {});
    }

    $scope.steps = store.get('steps');
  });
