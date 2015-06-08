'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var crypto = require('crypto');

var DemandeSchema = new Schema({
  createdAt:      { type: Date, default: Date.now },
  data:           { type: String }
});

module.exports = mongoose.model('Demande', DemandeSchema);
