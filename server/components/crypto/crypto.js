'use strict';

var _ = require('lodash');

exports.decode = function(demande) {
  var decoded = new Buffer(demande.data, 'base64').toString();
  var demandeObj = JSON.parse(decoded);

  demandeObj._id = demande._id;
  demandeObj.createdAt = demande.createdAt;
  demandeObj.etablissement = demande.etablissement;
  demandeObj.status = demande.status;
  demandeObj.notification = demande.notification;

  return demandeObj;
}

exports.encode = function(body) {
  var str = JSON.stringify(body);
  var encoded = new Buffer(str).toString('base64');
  return encoded;
}
