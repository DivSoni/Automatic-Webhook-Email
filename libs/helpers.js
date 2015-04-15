var moment = require('moment-timezone');

exports.formatTime = function(webhook) {
  return moment.tz(webhook.created_at, (webhook.time_zone || 'America/Los_Angeles')).format('h:mm a');
};


exports.formatDate = function(webhook) {
  return moment.tz(webhook.created_at, (webhook.time_zone || 'America/Los_Angeles')).format('MMM D, YYYY');
};


exports.formatVehicle = function(webhook) {
  if(!webhook.vehicle) {
    return 'Unknown';
  }
  return webhook.vehicle.year + ' ' + webhook.vehicle.make + ' ' + webhook.vehicle.model;
};


exports.formatEmail = function(webhook) {
  var message = 'At ' + exports.formatTime(webhook) + ' on ' + exports.formatDate(webhook) + ', a check engine light came on in your ' + exports.formatVehicle(webhook) + '.\n\n';

  webhook.dtcs.forEach(function(dtc) {
    message += dtc.code + ': ' + dtc.description + '\n';
  });

  message += '\nThis message was sent triggered from your Automatic.';

  return message;
};


exports.formatHTMLEmail = function(webhook) {
  var message = 'At <b>' + exports.formatTime(webhook) + '</b> on <b>' + exports.formatDate(webhook) + '</b>, a check engine light came on in your <b>' + exports.formatVehicle(webhook) + '</b>.<br><br>';

  webhook.dtcs.forEach(function(dtc) {
    message += '<b>' + dtc.code + '</b>: ' + dtc.description + '<br>';
  });

  message += '<br>This message was triggered from your <a href="https://automatic.com">Automatic</a>.';

  return message;
};
