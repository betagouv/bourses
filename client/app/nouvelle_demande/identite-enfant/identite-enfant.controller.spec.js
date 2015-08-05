'use strict';

describe('Controller: partenaire', function() {

  // load the service's module
  beforeEach(module('boursesApp'));

  it('should render initial data', function() {
    //given
    var scope = {};
    var store = {
      steps: {},
      set: function(str, val) {
        this[str] = val;
      },

      get: function(str) {
        return this[str];
      }
    };

    //when
    inject(function($controller) {
      $controller('IdentiteEnfantCtrl', {
        $scope: scope,
        store: store,
        college: null
      });
    });

    scope.submit({
      $valid: true
    });

    //then
    expect(store.steps.identiteEnfant).toBeDefined();

  });

});
