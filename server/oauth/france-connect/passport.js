var passport = require('passport');
var OAuth2Strategy = require('passport-oauth2').Strategy;
var request = require('superagent');

exports.setup = function(config) {
  var strategy = new OAuth2Strategy({
      authorizationURL: 'https://fcp.integ01.dev-franceconnect.fr/api/v1/authorize',
      tokenURL: 'https://fcp.integ01.dev-franceconnect.fr/api/v1/token',
      clientID: config.fc.clientId,
      clientSecret: config.fc.clientSecret,
      callbackURL: config.domain + '/oauth/fc/callback',
      scope: ['openid', 'profile', 'email', 'address', 'phone', 'dgfip_rfr', 'dgfip_nbpac', 'dgfip_sitfam', 'dgfip_nbpart'],
      state: 'foobar'
    },
    function(accessToken, refreshToken, profile, done) {
      var user = profile;
      user.accessToken = accessToken;
      done(null, user);
    }

  );
  strategy.authorizationParams = function() {
    // Pour ne garder que le FI dgfip:
    // return { nonce: 'foobar', selected_idp: 'dgfip' };
    return { nonce: 'foobar' };
  };

  strategy.userProfile = function(accessToken, done) {
    request
      .get('https://fcp.integ01.dev-franceconnect.fr/api/v1/userinfo')
      .query({ schema: 'openid' })
      .set('Authorization', 'Bearer ' + accessToken)
      .end(function(err, result) {
        if (err) return done(err);
        if (!result.body || !result.body.family_name) return done(new Error('Bad content'));
        done(null, result.body);
      });
  };

  passport.use('france-connect', strategy);
};
