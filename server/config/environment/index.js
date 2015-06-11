'use strict';

var path = require('path');
var _ = require('lodash');

function requiredProcessEnv(name) {
  if(!process.env[name]) {
    throw new Error('You must set the ' + name + ' environment variable');
  }
  return process.env[name];
}

// All configurations will extend these options
// ============================================
var all = {
  env: process.env.NODE_ENV,

  // Root path of server
  root: path.normalize(__dirname + '/../../..'),

  // Server port
  port: process.env.PORT || 9000,

  // Secret for session
  secrets: {
    session: process.env.SESSION_SECRET || 'bourses-secret'
  },

  domain: process.env.DOMAIN || 'http://localhost:5000',

  // List of user roles
  userRoles: ['user', 'admin'],

  // MongoDB connection options
  mongo: {
    options: {
      db: {
        safe: true
      }
    }
  },

  fc: {
    clientId: process.env.FC_CLIENT_ID || 'fc-clientId',
    clientSecret: process.env.FC_CLIENT_SECRET || 'fc-clientSecret'
  },

  smtpUser: process.env.SMTP_USER || 'toto',
  smtpPass: process.env.SMTP_PASS || 'password'

};

// Export the config object based on the NODE_ENV
// ==============================================
module.exports = _.merge(
  all,
  require('./' + process.env.NODE_ENV + '.js') || {});
