const debug = require('debug')('automatic-webhook-email');
const request = require('request');
const nconf = require('nconf');
const sendgrid  = require('sendgrid')(nconf.get('SENDGRID_USERNAME'), nconf.get('SENDGRID_PASSWORD'));
const db = require('../libs/database');
const helpers = require('../libs/helpers');
const apiURL = 'https://api.automatic.com';


exports.incoming = (req, res, next) => {
  console.log(req.body);

  if (!req.body || !req.body.user) {
    debug('Invalid Webhook');
  }

  if (req.body.type === 'mil:on') {
    db.getUser(req.body.user.id, (e, user) => {
      if (e) return debug(e);

      if (!user) {
        return debug('No Automatic user found');
      }

      request.get({
        uri: apiURL + '/user/me',
        headers: {Authorization: 'bearer ' + user.automatic_access_token},
        json: true
      }, (e, r, body) => {
        if (e) return debug(e);

        if (!body.email) {
          return debug('No email associated with user');
        }

        debug(body.email);

        sendgrid.send({
          to: body.email,
          toname: body.first_name + ' ' + body.last_name,
          from: 'noreply@yourdomain.com',
          fromname: 'Check Engine Notifications',
          subject: 'Check Engine Light Report for ' + helpers.formatVehicle(req.body),
          text: helpers.formatEmail(req.body),
          html: helpers.formatHTMLEmail(req.body)
        }, (e, json) => {
          if (e) return debug(e);

          console.log(json);
        });
      });
    });
  }
  res.sendStatus(200);
};
