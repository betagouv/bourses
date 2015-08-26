'use strict';

describe('Service: simulation', function() {

  // load the service's module
  beforeEach(module('boursesApp'));

  // instantiate service
  var simulation;
  beforeEach(inject(function(_simulation_) {
    simulation = _simulation_;
  }));

  it('should return 84 for 18061 and 2 children', function() {
    var montant = simulation(18061, 2);
    expect(montant).toBe(84);
  });

  it('should return 84 for 14674 and 1 children', function() {
    var montant = simulation(14674, 1);
    expect(montant).toBe(84);
  });

  it('should return 0 for 18002 and 1 children', function() {
    var montant = simulation(18002, 1);
    expect(montant).toBe(0);
  });

  it('should return 231 for 9763 and 2 children', function() {
    var montant = simulation(9763, 2);
    expect(montant).toBe(231);
  });

  it('should return 360 for 4737 and 4 children', function() {
    var montant = simulation(4737, 4);
    expect(montant).toBe(360);
  });

});
