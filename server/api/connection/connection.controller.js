'use strict';

var https = require('https');
var fs = require('fs');

var request = require('superagent');

var config = require('../../config/environment');

var apiParticulier = require('../../components/api_particulier/api_particulier');

var agentOptions = { hostname: config.dgfip.host };

if (config.dgfip.cert && config.dgfip.key) {
  agentOptions.key = fs.readFileSync(config.dgfip.key);
  agentOptions.cert = fs.readFileSync(config.dgfip.cert);
}

var boris = new https.Agent(agentOptions);

exports.svair = function(req, res, next) {

  apiParticulier(req.query.numeroFiscal, req.query.referenceAvis, function(err, result) {
    if (err) {
      return res.status(err.code).send(err);
    }

    return res.json(result);
  });
};

function fetchData(accessToken, year, done) {
  request.get(config.dgfip.baseUrl + '/' + year)
    .set('Authorization', 'Bearer ' + accessToken)
    .redirects(0)
    .agent(boris)
    .parse(request.parse.text)
    .buffer()
    .end(function(err, resp) {
      if (err && !err.status) return done(err);
      done(null, resp.text);
    });
}

exports.fc = function(req, res, next) {
  if (!req.user || !req.user.accessToken) {
    return res.status(401).send({
      code: 401,
      message: 'Utilisateur non authentifié'
    });
  }

  fetchData(req.user.accessToken, 2013, function(err, result) {
    if (err) return next(err);
    res.send({ response: result });
  });
};

exports.fetchData = fetchData;
