'use strict';

angular.module('boursesApp')
  .controller('EditCollegeCtrl', function($scope, $state, Etablissement, college, groups, count) {
    $scope.college = _.cloneDeep(college);
    $scope.groups = groups;
    $scope.count = count;

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
        $state.go('layout.college.demandes.pending', {}, {reload: true});
      });
    };
  });
