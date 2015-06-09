var passport = require('passport');
var OAuth2Strategy = require('passport-oauth2').Strategy;
var request = require('superagent');

exports.setup = function (config) {
  var strategy = new OAuth2Strategy({
      authorizationURL: 'https://fcp.integ01.dev-franceconnect.fr/api/v1/authorize',
      tokenURL: 'https://fcp.integ01.dev-franceconnect.fr/api/v1/token',
      clientID: config.fc.clientId,
      clientSecret: config.fc.clientSecret,
      callbackURL: config.domain + '/oauth/fc/callback',
      scope: ['openid', 'profile', 'email', 'address', 'phone', 'dgfip_avis_ir'],
      state: 'foobar'
    },
    function(accessToken, refreshToken, profile, done) {
      var user = profile;
      user.avis_ir = {
       dateRecouvrement: '31/07/2014',
       dateEtablissement: '10/07/2014',
       situationFamille: 'Pacsé(e)s',
       nombrePersonnesCharge: 0,
       revenuBrutGlobal: 40000,
       revenuImposable: 40000,
       impotRevenuNetAvantCorrections: 4000,
       montantImpot: 4000,
       revenuFiscalReference: 40000
      };
      done(null, user);
    }
  );
  strategy.authorizationParams = function () {
    return { nonce: 'foobar' };
  };
  strategy.userProfile = function (accessToken, done) {
    request
      .get('https://fcp.integ01.dev-franceconnect.fr/api/v1/userinfo')
      .query({ schema: 'openid' })
      .set('Authorization', 'Bearer ' + accessToken)
      .end(function (err, result) {
        if (err) return done(err);
        if (!result.body || !result.body.family_name) return done(new Error('Bad content'));
        done(null, result.body);
      });
  };
  passport.use('france-connect', strategy);
};
