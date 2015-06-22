'use strict';

describe('Service: simulation', function () {

  // load the service's module
  beforeEach(module('boursesApp'));

  // instantiate service
  var simulation;
  beforeEach(inject(function (_simulation_) {
    simulation = _simulation_;
  }));

  it('should return 84 for 18003 and 2 children', function () {
    var montant = simulation(18003, 2);
    expect(montant).toBe(84);
  });

  it('should return 84 for 14627 and 1 children', function () {
    var montant = simulation(14627, 1);
    expect(montant).toBe(84);
  });

  it('should return 0 for 18002 and 1 children', function () {
    var montant = simulation(18002, 1);
    expect(montant).toBe(0);
  });

  it('should return 228 for 9732 and 2 children', function () {
    var montant = simulation(9732, 2);
    expect(montant).toBe(228);
  });

  it('should return 84 for 9733 and 2 children', function () {
    var montant = simulation(9733, 2);
    expect(montant).toBe(84);
  });

  it('should return 357 for 4720 and 4 children', function () {
    var montant = simulation(4720, 4);
    expect(montant).toBe(357);
  });

});
