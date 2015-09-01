'use strict';

var _ = require('lodash');
var async = require('async');
var Etablissement = require('../etablissement/etablissement.model');
var User = require('../user/user.model');
var Demande = require('../demande/demande.model');
var moment = require('moment');

function countRequests(data, etablissements, done) {
  async.eachSeries(etablissements, function(etablissement, callback) {
    Demande.find({
      etablissement: etablissement._id
    }, function(err, list) {
      data[etablissement._id].requests = {};
      data[etablissement._id].requests.total = err || !list ? 0 : list.length;

      var requestByStatus = _.groupBy(list, 'status');
      _.forEach(['new', 'pending', 'done'], function(status) {
        var requestsForStatus = requestByStatus[status] ? requestByStatus[status].length : 0;
        data[etablissement._id].requests[status] = requestsForStatus;
      });

      callback();
    });
  },

  function(err) {
    if (err) { throw err; }

    return done();
  });
}

exports.etablissement = function(req, res) {
  Etablissement.find().sort('zipcode').exec(function(err, etablissements) {
    if (err) { return handleError(req, res, err); }

    var data = [];
    etablissements.forEach(function(etablissement) {
      data.push({
        nom: etablissement.nom,
        _id: etablissement._id
      });
    });

    var dataByVille = _.indexBy(data, '_id');
    countRequests(dataByVille, etablissements, function() {
      res.json(data);
    });
  });
};

function getOneWeekAgo() {
  var oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  return oneWeekAgo;
}

exports.history = function(req, res) {
  Demande.find({
    createdAt: {$gte: getOneWeekAgo()}
  }).sort('createdAt').exec(function(err, demandes) {
    if (err) { return handleError(req, res, err); }

    if (!demandes) {
      return res.json({});
    }

    demandes.forEach(function(request) {
      request.createdAtByDay = moment(request.createdAt).format('DD/MM/YYYY');
    });

    var groupByDate = _.groupBy(demandes, 'createdAtByDay');
    var data = [];
    _.forEach(groupByDate, function(demandes, date) {
      data.push({
        date: date,
        count: demandes.length
      });
    });

    res.json(data);
  });
};

function handleError(req, res, err) {
  req.log.error(err);
  return res.status(500).send(err);
}
