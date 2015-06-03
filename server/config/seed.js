/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var User = require('../api/user/user.model');
var async = require('async');

var deleteUsers = function(cb) {
  User.remove({}, function() {
    console.log('finished deleting users');
    cb();
  });
};

var createAdmin = function(cb) {
  User.create({
    provider: 'local',
    role: 'admin',
    name: 'Admin',
    email: 'admin@admin.com',
    password: 'admin'
  }, function(err, data) {
    console.log('finished creating user ' + data.email);
    cb();
  });
};

async.series([
  deleteUsers,
  createAdmin
]);
