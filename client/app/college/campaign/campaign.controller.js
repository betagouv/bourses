'use strict';

angular.module('boursesApp')
  .controller('CampaignCollegeCtrl', function($scope, $state, Etablissement, college, groups, count) {
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
      switch (type) {
        case 'enfant':
          $scope.expression = 'identiteEnfant.nom';
          break;
        case 'adulte':
          $scope.expression = 'identiteAdulte.demandeur.nom';
          break;
        case 'email':
          $scope.expression = 'identiteAdulte.email';
          break;
      }
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
          case '84':
            taux = '1';
            break;
          case '231':
            taux = '2';
            break;
          case '360':
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
