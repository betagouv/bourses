'use strict';

angular.module('boursesApp')
  .controller('CampaignCollegeCtrl', function($scope, $state, Etablissement, college, groups, count, getCorrespondingExpression) {
    $scope.college = _.cloneDeep(college);
    $scope.groups = groups;
    $scope.count = count;
    $scope.total = _.reduce(count, function(total, n) {
      return total + n;
    });

    $scope.expression = 'identiteEnfant.nom';
    $scope.reverse = false;
    $scope.type = 'enfant';

    $scope.toggleSort = function(type) {
      $scope.expression = getCorrespondingExpression(type);
      if (type === $scope.type) {
        $scope.reverse = !$scope.reverse;
      }

      $scope.type = type;
    };

    $scope.getLabel = function(group, demandes) {
      var str = demandes.length + ' demandes ';
      if (group === '0') {
        str += 'refusées';
      } else {
        var taux;
        switch (group) {
        case '35':
          taux = '1';
          break;
        case '96':
          taux = '2';
          break;
        case '150':
          taux = '3';
        }
        str += ' de taux ' + taux + ' (' + group + '€)';
      }

      return str;
    };

    $scope.submit = function(form) {
      if (!form.$valid) {
        return;
      }

      Etablissement.update($scope.college, function() {
        $state.go('.', {}, {reload: true});
      });
    };
  });
