'use strict';

angular.module('boursesApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('layout.college', {
        url: '/college/:id',
        templateUrl: 'app/college/college.html',
        resolve: {
          id: function($stateParams) {
            return $stateParams.id;
          }
        },
        abstract: true
      })
      .state('layout.college.edit', {
        url: '/edit',
        templateUrl: 'app/college/edit.html',
        controller: function($scope, $state, Etablissement, id) {
          $scope.college = Etablissement.get({id: id});
          $scope.submit = function(form) {
            if (!form.$valid) {
              return;
            }

            $scope.college.$update(function() {
              $state.go('layout.admin');
            });
          }
        }
      });
  });
