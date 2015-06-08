'use strict';

// Development specific configuration
// ==================================
module.exports = {
  // MongoDB connection options
  mongo: {
    uri: 'mongodb://localhost/bourses-dev'
  },

  // Should we populate the DB with sample data?
  seedDB: true,

  port: 5000
};
