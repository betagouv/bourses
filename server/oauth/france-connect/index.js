'use strict';

var express = require('express');
var passport = require('passport');

var router = express.Router();

router.get('/', passport.authenticate('france-connect'));

router.get('/callback', passport.authenticate('france-connect', { failureRedirect: '/' }), function (req, res) {
  res.redirect('/nouvelle_demande/vos-ressources');
});

router.get('/logout', function (req, res) {
	req.logout();
	res.redirect('https://fcp.integ01.dev-franceconnect.fr/api/v1/logout');
});

module.exports = router;
