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
    session: process.env.SESSION_SECRET || 'ssshhhhh'
  },

  domain: process.env.DOMAIN || 'http://localhost:5000',

  fc: {
    clientId: process.env.FC_CLIENT_ID || 'fc-clientId',
    clientSecret: process.env.FC_CLIENT_SECRET || 'fc-clientSecret'
  },

  apiParticulier: {
    token: process.env.API_PARTICULIER_TOKEN || 'test-token',
    url: process.env.API_PARTICULIER_URL || 'https://particulier-test.api.gouv.fr/api/impots/svair'
  },

  dgfip: {
    host: process.env.DGFIP_HOST,
    baseUrl: process.env.DGFIP_BASE_URL || 'http://localhost:5000/api/connection/mock',
    cert: process.env.DGFIP_CERT_LOCATION,
    key: process.env.DGFIP_KEY_LOCATION
  },

  sendGrid: {
    apiKey: process.env.SENDGRID_API_KEY || 'sendgrid_api_key'
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
