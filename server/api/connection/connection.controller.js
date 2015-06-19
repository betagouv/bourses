'use strict';

var https = require('https');
var fs = require('fs');

var svair = require('svair-api');
var request = require('superagent');

var config = require('../../config/environment');

var agentOptions = { hostname: config.dgfip.host };

if (config.dgfip.cert && config.dgfip.key) {
  agentOptions.key = fs.readFileSync(config.dgfip.key);
  agentOptions.cert = fs.readFileSync(config.dgfip.cert);
}

var boris = new https.Agent(agentOptions);

exports.svair = function (req, res, next) {
  if (!req.query.numeroFiscal || !req.query.referenceAvis) {
    return res.status(400).send({
      code: 400,
      message: 'Requête incorrecte',
      explaination: 'Les paramètres numeroFiscal et referenceAvis doivent être fournis dans la requête.'
    });
  } else {
    svair(req.query.numeroFiscal, req.query.referenceAvis, function (err, result) {
      if (err && err.message === 'Invalid credentials') {
        res.status(404).send({
          code: 404,
          message: 'Résultat non trouvé',
          explaination: 'Les paramètres fournis sont incorrects ou ne correspondent pas à un avis'
        });
      } else if (err) {
        next(err);
      } else {
        res.json(result);
      }
    });
  }
};

function fetchData(accessToken, year, done) {
  request.get(config.dgfip.baseUrl + '/' + year)
    .set('Authorization', 'Bearer ' + accessToken)
    .redirects(0)
    .agent(boris)
    .parse(request.parse.text)
    .buffer()
    .end(function (err, resp) {
      if (err && !err.status) return done(err);
      done(null, resp.text);
    });
}

exports.fc = function (req, res, next) {
  if (!req.user || !req.user.accessToken) {
    return res.status(401).send({
      code: 401,
      message: 'Utilisateur non authentifié'
    });
  }

  fetchData(req.user.accessToken, 2013, function (err, result) {
    if (err) return next(err);
    res.send({ response: result });
  });
};

exports.fetchData = fetchData;
