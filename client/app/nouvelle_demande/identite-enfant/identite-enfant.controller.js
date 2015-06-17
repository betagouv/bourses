'use strict';


angular.module('boursesApp')
  .controller('IdentiteEnfantCtrl', function($scope, $state, $http, store) {
    $scope.etablissements = [];
    $http.get('/api/etablissements').then(function(result) {
      var data = result.data;
      _.map(data, function(etablissement) {
        if (etablissement.ville) {
          etablissement.ville.label = label(etablissement.ville);
        }
      });

      $scope.etablissements = data;
    });

    $scope.identite = store.get('identite-enfant') || {};
    var steps = store.get('steps');

    $scope.submit = function(form) {
      store.set('identite-enfant', $scope.identite);
      steps.identiteEnfant = form.$valid;

      if (form.$valid) {
        store.set('steps', steps);
        $state.go('layout.nouvelle_demande.vos-ressources');
      }
    };

    var label = function(city) {
      return city.nom + ', ' + city.codePostal;
    }
  });
