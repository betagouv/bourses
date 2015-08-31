'use strict';

angular.module('boursesApp')
  .controller('DemandeEditCtrl', function($scope, $timeout, $http, $window, Auth, demandeId, demande) {
    $scope.demande = demande;
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

    $scope.save = function() {
      $scope.saving = 'pending';
      $http.post('/api/demandes/comment/' + demandeId, {observations: demande.observations}).then(function() {
        $scope.saving = 'success';
        $timeout(function() {
          $scope.saving = '';
        }, 500);
      });
    };
  });
