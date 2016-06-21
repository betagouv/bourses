'use strict';

var https = require('https');
var fs = require('fs');

var request = require('superagent');

var config = require('../../config/environment');

var agentOptions = { hostname: config.dgfip.host };

if (config.dgfip.cert && config.dgfip.key) {
  agentOptions.key = fs.readFileSync(config.dgfip.key);
  agentOptions.cert = fs.readFileSync(config.dgfip.cert);
}

var boris = new https.Agent(agentOptions);

exports.svair = function(req, res, next) {
  if (!req.query.numeroFiscal || !req.query.referenceAvis) {
    return res.status(400).send({
      code: 400,
      message: 'Requête incorrecte',
      explaination: 'Les paramètres numeroFiscal et referenceAvis doivent être fournis dans la requête.'
    });
  } else {
    request
      .get(config.apiParticulier.url)
      .query(req.query)
      .set('X-API-Key', config.apiParticulier.token)
      .set('Accept', 'application/json')
      .end(function(err, result) {
        if (err && err.message === 'Invalid credentials') {
          res.status(404).send({
            code: 404,
            message: 'Résultat non trouvé',
            explaination: 'Les paramètres fournis sont incorrects ou ne correspondent pas à un avis'
          });
        } else if (err) {
          next(err);
        } else {
          if (!result.body.declarant2.nom) {
            delete result.body.declarant2;
          }

          res.json(result.body);
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
    .end(function(err, resp) {
      if (err && !err.status) return done(err);
      done(null, resp.text);
    });
}

exports.mockData = function(req, res) {
  res.json({
    identites: [{nom: 'DUPONT', prenoms: 'MARCEL'}],
    rfr: 0, sitFam:'C', nbPart:'1.0', pac:{nbPac:'0'}
  });
};

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
