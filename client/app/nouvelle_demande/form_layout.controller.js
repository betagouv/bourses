'use strict';

angular.module('boursesApp')
  .controller('FormLayoutCtrl', function($scope, store, etablissements) {
    if (store.get('steps') === null) {
      store.set('steps', {});
    }

    $scope.etablissements = etablissements;
    $scope.etablissementsById = _.indexBy(etablissements, '_id');

    $scope.identite = store.get('identite-enfant') || {};

    var etablissement = $scope.identite.college ? _.find($scope.etablissements, {_id: $scope.identite.college}) : null;

    $scope.selectedCollege = etablissement;
    $scope.selectedCollegeLabel = etablissement && etablissement.label;
    $scope.steps = store.get('steps');
  });
