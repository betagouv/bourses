'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var crypto = require('crypto');

var DemandeSchema = new Schema({
  createdAt:      { type: Date, default: Date.now },
  observations:   { type: String },
  data:           { type: String },
  etablissement:  { type: Schema.Types.ObjectId, ref: 'Etablissement' },
  status:         { type: String, enum: ['new', 'pending', 'done'], default: 'new' }
});

module.exports = mongoose.model('Demande', DemandeSchema);
