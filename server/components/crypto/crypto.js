'use strict';

var _ = require('lodash');

exports.decode = function(demande) {
  // var decoded = new Buffer(demande.data, 'base64').toString();
  // var demandeObj = JSON.parse(decoded);

  var demandeObj =  _.assign({}, demande.data);

  demandeObj._id = demande._id;
  demandeObj.createdAt = demande.createdAt;
  demandeObj.etablissement = demande.etablissement;
  demandeObj.status = demande.status;
  demandeObj.notification = demande.notification;
  demandeObj.observations = demande.observations;

  return demandeObj;
};

exports.encode = function(body) {
  return body;

  // var str = JSON.stringify(body);
  // var encoded = new Buffer(str).toString('base64');
  // return encoded;
};
