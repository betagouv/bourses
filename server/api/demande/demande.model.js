'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var crypto = require('crypto');

var DemandeSchema = new Schema({
  createdAt:      { type: Date, default: Date.now },
  observations:   { type: String },
  data:           { type: String },
  college:        { type: Schema.Types.ObjectId, ref: 'College' },
});

module.exports = mongoose.model('Demande', DemandeSchema);
