'use strict';

var User = require('./user.model');
var config = require('../../config/environment');
var jwt = require('jsonwebtoken');
var shortid = require('shortid');
var sendMail = require('../../components/mail/send-mail').sendMail;

var validationError = function(res, err) {
  return res.status(422).json(err);
};

/**
 * Get list of users
 * restriction: 'admin'
 */
exports.index = function(req, res) {
  User.find({}, '-salt -hashedPassword', function(err, users) {
    if (err) return res.status(500).send(err);
    res.json(users);
  });
};

/**
 * Creates a new user
 * restriction: 'admin'
 */
exports.create = function(req, res) {
  var newUser = new User(req.body);
  newUser.provider = 'local';
  newUser.role = 'user';
  newUser.save(function(err, user) {
    if (err) return validationError(res, err);
    var token = jwt.sign({_id: user._id }, config.secrets.session, { expiresIn: 60 * 60 * 5 });
    res.json({ token: token });
  });
};

/**
 * Deletes a user
 * restriction: 'admin'
 */
exports.destroy = function(req, res) {
  User.findByIdAndRemove(req.params.id, function(err) {
    if (err) return res.status(500).send(err);
    return res.sendStatus(204);
  });
};

/**
 * Get my info
 */
exports.me = function(req, res, next) {
  var userId = req.user._id;
  User
    .findOne({ _id: userId })
    .populate('etablissement')
    .select('-salt -hashedPassword')
    .exec(function(err, user) { // don't ever give out the password or salt
      if (err) return next(err);
      if (!user) return res.status(401);
      res.json(user);
    });
};

/**
 * Authentication callback
 */
exports.authCallback = function(req, res) {
  res.redirect('/');
};

/**
 * Post to check if email exists
 */
exports.generateTokenForPassword = function(req, res, next) {
  let email = req.body.email;

  User.findOne({
    email: email
  }, function(err, user) {
    if (err) return next(err);
    if (!user) return res.sendStatus(200);
    user.newPasswordToken = shortid.generate();
    user.save(function(err) {
      if (err) return validationError(res, err);

      let confirmationUrl = 'http://' + req.headers.host + '/nouveau_mot_de_passe/' + user._id + '/' + user.newPasswordToken;
      let subject = 'Nouveau mot de passe';
      let body = 'Veuillez cliquer ici pour continuer votre changement de mot de passe :<br>' + confirmationUrl;

      sendMail(user.email, 'contact@bourse.beta.gouv.fr', subject, body);

      res.sendStatus(200);
    });
  });
};

exports.newPassword = function(req, res) {
  User.findById(req.params.id, '+newPasswordToken', function(err, user) {
    if (err) return handleError(req, res, err);
    if (!user) return res.sendStatus(404);
    if (!req.params.secret) return res.sendStatus(400);
    if (req.params.secret !== user.newPasswordToken) return res.sendStatus(400);
    user.password = req.body.newPassword;
    user.newPasswordToken = '';
    user.save(function(err) {
      if (err) return validationError(res, err);
      return res.sendStatus(200);
    });
  });
};
