'use strict';

var _ = require('lodash');
var jwt = require('jsonwebtoken');

var config = require('../../config/environment');

exports.decode = function(demande) {
  var demandeObj =  _.assign({}, demande.data);

  demandeObj._id = demande._id;
  demandeObj.createdAt = demande.createdAt;
  demandeObj.rfr = demande.rfr;
  demandeObj.etablissement = demande.etablissement;
  demandeObj.status = demande.status;
  demandeObj.notification = demande.notification;
  demandeObj.observations = demande.observations;
  demandeObj.isDuplicate = demande.isDuplicate;
  demandeObj.error = demande.error;

  return demandeObj;
};

exports.encode = function(body) {
  return body;
};

exports.encryptId = function(demande) {
  return jwt.sign({_id: demande._id}, config.secrets.session);
};

exports.decryptId = function(token) {
  return jwt.verify(token, config.secrets.session, {ignoreExpiration: true});
};
