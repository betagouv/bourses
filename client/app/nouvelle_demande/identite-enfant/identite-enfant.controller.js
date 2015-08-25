'use strict';

angular.module('boursesApp')
  .controller('IdentiteEnfantCtrl', function($scope, $state, $http, $timeout, store, college) {
    $scope.etablissements = [];
    $http.get('/api/etablissements').then(function(result) {
      var data = result.data;
      _.map(data, function(etablissement) {
        if (etablissement.ville) {
          etablissement.ville.label = label(etablissement.ville);
        }
      });

      $scope.etablissements = data;

      if (college) {
        var etablissement = _.find(data, {human_id: college});
        $scope.identite.college = etablissement._id;
      }
    });

    $scope.identite = store.get('identite-enfant');
    var steps = store.get('steps');

    $scope.submit = function(form) {
      store.set('identite-enfant', $scope.identite);
      steps.identiteEnfant = form.$valid;

      if (form.$valid && $scope.identite && $scope.identite.garde && $scope.identite.regime) {
        store.set('steps', steps);
        $state.go('layout.nouvelle_demande.vos-ressources');
      }
    };

    var label = function(city) {
      return city.nom + ', ' + city.codePostal;
    };
  });
