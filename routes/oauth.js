const request = require('request');
const nconf = require('nconf');
const db = require('../libs/database');


const oauth2 = require('simple-oauth2')({
  clientID: nconf.get('AUTOMATIC_CLIENT_ID'),
  clientSecret: nconf.get('AUTOMATIC_CLIENT_SECRET'),
  site: 'https://accounts.automatic.com',
  tokenPath: '/oauth/access_token'
});


const authorizationUri = oauth2.authCode.authorizeURL({
  scope: 'scope:user:profile scope:vehicle:profile scope:vehicle:events'
});


exports.authorize = (req, res, next) => {
  res.redirect(authorizationUri);
};


exports.logout = (req, res, next) => {
  req.session.destroy();
  res.redirect('/');
};


exports.redirect = (req, res, next) => {
  if (req.query.denied === 'true') {
    return res.redirect('/?alert=User denied access to Automatic');
  }

  oauth2.authCode.getToken({
    code: req.query.code
  }, (e, result) => {
    if (e) return next(e);

    const token = oauth2.accessToken.create(result);

    const user = {
      automatic_access_token: token.token.access_token,
      automatic_refresh_token: token.token.refresh_token,
      automatic_expires_at: token.token.expires_at,
      automatic_id: token.token.user.id
    };

    req.session.access_token = user.automatic_access_token;
    req.session.automatic_id = user.automatic_id;

    db.saveUser(user, (e, user) => {
      if (e) return next(e);
      res.redirect('/');
    });
  });
};
