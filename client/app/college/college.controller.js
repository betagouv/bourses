'use strict';

angular.module('boursesApp')
  .controller('CollegeCtrl', function ($scope, Etablissement, id) {

    $scope.demandes = Etablissement.queryDemandes({id: id});

  });
