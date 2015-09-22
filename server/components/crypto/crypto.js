'use strict';

var _ = require('lodash');
var crypto = require('crypto');

//var config = require('../../config/environment');
var jwt = require('jsonwebtoken');

exports.decode = function(demande) {
  var demandeObj =  _.assign({}, demande.data);

  demandeObj._id = demande._id;
  demandeObj.createdAt = demande.createdAt;
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
  return jwt.sign({_id: demande._id}, 'ssshhhhh'); //config.secrets.session);
};

exports.decryptId = function(token) {
  return jwt.verify(token, 'ssshhhhh'); //config.secrets.session);
};
