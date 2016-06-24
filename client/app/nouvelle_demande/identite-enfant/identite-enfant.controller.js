'use strict';

angular.module('boursesApp')
  .controller('IdentiteEnfantCtrl', function($scope, $state, $http, $timeout, store, etablissements) {
    $scope.etablissements = etablissements;
    $scope.etablissementsById = _.indexBy(etablissements, '_id');
    $scope.identite = store.get('identite-enfant') || {};

    var etablissement = $scope.identite.college ? _.find($scope.etablissements, {_id: $scope.identite.college}) : null;

    $scope.selectedCollege = etablissement;
    $scope.selectedCollegeLabel = etablissement && etablissement.label;

    var steps = store.get('steps');

    $scope.select = function(item) {
      $scope.identite.college = item._id;
      $scope.selectedCollege = item;
    };

    $scope.submit = function(form) {
      store.set('identite-enfant', $scope.identite);
      steps.identiteEnfant = form.$valid;

      if (form.$valid && $scope.identite && $scope.identite.garde && $scope.identite.regime) {
        store.set('steps', steps);
        $state.go('layout.nouvelle_demande.vos-ressources');
      }
    };
  });
