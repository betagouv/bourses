'use strict';

angular.module('boursesApp')
  .controller('DemandeEditCtrl', function($scope, $timeout, $http, $window, $modal, $state, Auth, demandeId, demandeWithSvair) {
    $scope.demande = demandeWithSvair;
    $scope.demandeId = demandeId;
    $scope.token = Auth.getToken();

    $scope.$emit('updateCount');

    var myEl = angular.element(document.querySelector('#nav-menu'));

    angular.element($window).bind('scroll', function() {
      if (this.pageYOffset >= 395) {
        myEl.addClass('affix');
      } else {
        myEl.removeClass('affix');
      }
    });

    $scope.delete = function() {
      var instance = $modal.open({
        animation: true,
        templateUrl: 'app/college/demandes/delete/delete.html',
        controller: 'DeleteCtrl',
        resolve: {
          demande: function() {
            return demandeWithSvair;
          }
        }
      });

      instance.result.then(function() {
        $state.go('layout.college.demandes.new', {}, {reload: true});
      });
    };

    $scope.save = function() {
      $scope.saving = 'pending';
      $http.post('/api/demandes/comment/' + demandeId, {observations: demandeWithSvair.observations}).then(function() {
        $scope.saving = 'success';
        $timeout(function() {
          $scope.saving = '';
        }, 500);
      });
    };
  });
