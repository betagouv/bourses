'use strict';

var moment = require('moment');

exports.isCampaignOver = function() {
  return moment().isAfter(moment('2015-10-17'));
};
