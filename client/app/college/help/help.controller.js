'use strict';

angular.module('boursesApp')
  .controller('HelpCollegeCtrl', function($scope, Etablissement, college) {
    $scope.departement = college.ville.codePostal.substring(0, 2);
    $scope.colleges = Etablissement.query();
    $scope.codePostalFilter = function(college) {
      return college.ville.codePostal.startsWith($scope.departement);
    };
  });
