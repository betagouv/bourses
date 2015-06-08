'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var crypto = require('crypto');

var DemandeSchema = new Schema({
  createdAt:      { type: Date },
  data:           { type: String }
});

module.exports = mongoose.model('Demande', DemandeSchema);
