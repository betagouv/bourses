'use strict';

var express = require('express');
var passport = require('passport');

var router = express.Router();

router.get('/', function(req, res, next) {
  if (req.user && req.user.accessToken) {
    return res.redirect('https://app.franceconnect.gouv.fr/api/v1/logout?force');
  }

  next();
}, passport.authenticate('france-connect'));

router.get('/callback', passport.authenticate('france-connect', { failureRedirect: '/' }), function(req, res) {
  res.redirect('/nouvelle_demande/vos-ressources');
});

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('https://app.franceconnect.gouv.fr/api/v1/logout?force');
});

module.exports = router;
