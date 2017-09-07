'use strict';

angular.module('boursesApp')
  .controller('IdentiteEnfantCtrl', function($scope, $state, $http, $timeout, store) {

    if (!String.prototype.startsWith) {
      String.prototype.startsWith = function(searchString, position) {
        position = position || 0;
        return this.substr(position, searchString.length) === searchString;
      };
    }

    var steps = store.get('steps');

    function clean(value) {
      return value
        .replace(/á|à|â|ä/g, 'a')
        .replace(/è|é|ê|ë/g, 'e')
        .replace(/í|î|ï/g, 'i')
        .replace(/ó|ô|ö/g, 'o')
        .replace(/ú|û|ù/g, 'u')
        .replace(/ /g, '')
        .toLowerCase();
    }

    $scope.search = function(query) {
      return function(college) {
        return !query ||
          (clean(college.ville.nom).indexOf(clean(query)) !== -1) ||
          (clean(college.nom).indexOf(clean(query)) !== -1) ||
          (college.ville.codePostal.startsWith(query));
      };
    };

    $scope.select = function(item) {
      $scope.identite.college = item._id;
      $scope.selectedCollege = item;
      $scope.$parent.selectedCollege = item;
    };

    $scope.submit = function(form) {
      store.set('identite-enfant', $scope.identite);
      steps.identiteEnfant = form.$valid;

      if (form.$valid && $scope.identite && $scope.identite.regime) {
        store.set('steps', steps);
        $state.go('layout.nouvelle_demande.vos-ressources');
      }
    };
  });
