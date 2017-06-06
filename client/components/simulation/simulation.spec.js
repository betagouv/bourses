'use strict';

describe('Service: simulation', function() {

  // load the service's module
  beforeEach(module('boursesApp'));

  // instantiate service
  var simulation;
  beforeEach(inject(function(_simulation_) {
    simulation = _simulation_;
  }));

  it('should return 35 for 18253 and 2 children', inject(function(_simulation_) {
    var montant = _simulation_(18253, 2);
    expect(montant).toBe(35);
  }));

  it('should return 35 for 14831 and 1 children', function() {
    var montant = simulation(14831, 1);
    expect(montant).toBe(35);
  });

  it('should return 0 for 14832 and 1 children', function() {
    var montant = simulation(14832, 1);
    expect(montant).toBe(0);
  });

  it('should return 96 for 9867 and 2 children', function() {
    var montant = simulation(9867, 2);
    expect(montant).toBe(96);
  });

  it('should return 150 for 4787 and 4 children', function() {
    var montant = simulation(4787, 4);
    expect(montant).toBe(150);
  });

  it('should return 150 for 7000 and 12 children', function() {
    var montant = simulation(7000, 12);
    expect(montant).toBe(150);
  });
});
