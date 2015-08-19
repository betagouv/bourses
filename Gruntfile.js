'use strict';

module.exports = function(grunt) {
  require('load-grunt-config')(grunt, {
    data: {
      port: process.env.PORT || 5000
    }
  });
  require('time-grunt')(grunt);
};
