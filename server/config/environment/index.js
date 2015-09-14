'use strict';

var path = require('path');
var _ = require('lodash');

function requiredProcessEnv(name) {
  if (!process.env[name]) {
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

  fc: {
    clientId: process.env.FC_CLIENT_ID || 'fc-clientId',
    clientSecret: process.env.FC_CLIENT_SECRET || 'fc-clientSecret'
  },

  dgfip: {
    host: process.env.DGFIP_HOST,
    baseUrl: process.env.DGFIP_BASE_URL || 'http://localhost:5000/api/connection/mock',
    cert: process.env.DGFIP_CERT_LOCATION,
    key: process.env.DGFIP_KEY_LOCATION
  },

  // List of user roles
  userRoles: ['user', 'admin'],

  // MongoDB connection options
  mongo: {
    options: {
      db: {
        safe: true
      }
    }
  }
};

// Export the config object based on the NODE_ENV
// ==============================================
module.exports = _.merge(
  all,
  require('./' + process.env.NODE_ENV + '.js') || {});
