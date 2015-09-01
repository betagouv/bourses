'use strict';

angular.module('boursesApp')
  .controller('StatsCtrl', function($scope, $http) {
    $scope.sumRequests = function(colleges) {
      var count = 0;
      if (colleges) {
        _.forEach(colleges, function(college) {
          count += college.requests.total;
        });
      }

      return count;
    };

    function sumByType(colleges) {
      var series = [];
      var types = ['new', 'pending', 'done'];
      types.forEach(function(type) {
        var data = [];
        _.forEach(colleges, function(college) {
           data.push(college.requests[type]);
         });

        series.push(data);
      });

      return series;
    }

    $http.get('/api/stats/etablissement').then(function(result) {
      $scope.colleges = result.data;
      $scope.labels = _.pluck(result.data, 'nom');
      $scope.dataTotal = _.pluck(result.data, 'requests.total');

      $scope.series = ['Nouvelles', 'En cours', 'Traitées'];
      $scope.data = sumByType(result.data);
    });

    $http.get('/api/stats/history').then(function(result) {
      $scope.history = result.data;
      $scope.historyLabels = _.pluck(result.data, 'date');
      $scope.historyData = [_.pluck(result.data, 'count')];
      $scope.historySeries = ['Nombre de demandes'];
    });
  });
