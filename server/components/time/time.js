'use strict';

exports.isCampaignOver = function(college) {
  return !college.ouverture_service;
};
