'use strict';

var expect = require('chai').expect;
var csv = require('./csv');

describe('CSV', function () {
  it('should return the correct header', function () {
    var columns = [
      {
        title: 'Col1'
      },
      {
        title: 'Col2'
      }
    ];

    var header = csv.createHeader(columns);

    expect(header).to.be.equal('Col1;Col2;\n');
  });
});
