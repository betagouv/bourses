const request = require('superagent');
const config = require('../../config/environment');

const incorrect = {
  code: 400,
  message: 'Requête incorrecte',
  explaination: 'Les paramètres numeroFiscal et referenceAvis doivent être fournis dans la requête.'
};

const notFound = {
  code: 404,
  message: 'Résultat non trouvé',
  explaination: 'Les paramètres fournis sont incorrects ou ne correspondent pas à un avis'
};

module.exports = function(numeroFiscal, referenceAvis, done) {
  if (!numeroFiscal || !referenceAvis) {
    return done ? done(incorrect) : Promise.reject(incorrect);
  } else {
    request
      .get(config.apiParticulier.url)
      .query({numeroFiscal: numeroFiscal, referenceAvis: referenceAvis})
      .set('X-API-Key', config.apiParticulier.token)
      .set('Accept', 'application/json')
      .end(function(err, result) {
        if (err && err.message === 'Invalid credentials') {
          return done ? done(notFound) : Promise.reject(incorrect);
        } else if (err) {
          return done ? done(err) : Promise.reject(incorrect);
        } else {
          if (!result.body.declarant2.nom) {
            delete result.body.declarant2;
          }

          return done ? done(null, result.body) : Promise.resolve(incorrect);
        }
      });
  }
};
