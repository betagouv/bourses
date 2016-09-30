'use strict';

var columns = require('./columns').columns;
var extraColumns = require('./columns').extraColumns;
var crypto = require('../../../components/crypto/crypto');

function createHeader(columns) {
  var header = columns
    .map(function(column) {
      return column.title;
    })
    .reduce(function(csv, column) {
      return csv + column + ';';
    }, '');

  return header + '\n';
}

function createRow(columns, demande, college) {
  var row = columns
    .map(function(column) {
      return column.prepare(demande, college);
    })
    .reduce(function(csv, column) {
      return csv + column + ';';
    }, '');

  return row + '\n';
}

function createRows(columns, demandes, college) {
  var rows = '';

  for (var demande of demandes) {
    rows += createRow(columns, demande, college);
  }

  return rows;
}

function generate(demandes, college, callback) {
  var csvColumns = columns;

  if (college.gestion_cantine) {
    csvColumns = csvColumns.concat(extraColumns.aideDepartementale);
  }

  var csv = createHeader(csvColumns) + createRows(csvColumns, demandes, college);

  if (callback) {
    return callback(null, csv);
  }

  return csv;
}

exports.generate = generate;
exports.createHeader = createHeader;
exports.createRows = createRows;
