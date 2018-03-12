'use strict';

const superagent = require('superagent');

const GOOGLE_OAUTH_URL = 'https://www.googleapis.com/oauth2/v4/token';
const OPEN_ID_URL = 'https://www.googleapis.com/plus/v1/people/me/openIdConnect';

module.exports = router => {
  router.route('/oauth/google')
  
    .get((req, res) => {
      console.log(req.query);
      if (!req.query.code) res.redirect(process.env.CLIENT_URL);
      else {
        console.log(req.query.code);
        return superagent.post(GOOGLE_OAUTH_URL)
          .type('form')
          .send({
            code: req.query.code,
            grant_type: 'authorization_code',
            client_id: process.env.GOOGLE_OAUTH_ID,
            client_secret: process.env.GOOGLE_OAUTH_SECRET,
            redirect_uri: `${process.env.API_URL}/api/v1/oauth/google`,
          })
          .then(googleResponse => {
            console.log('Google oAuth Response Received');
            if (!googleResponse.body.access_token) res.redirect(process.env.CLIENT_URL);
            console.log('google response', googleResponse.body.access_token);
            const gToken = googleResponse.body.access_token;
            return superagent.get(OPEN_ID_URL)
              .set('Authorization', `Bearer ${gToken}`)
              .then(openIdResponse => {
                console.log('OpenID Response Received');
                console.log(openIdResponse.body);
                res.cookie('X-401d21-Oauth-Cookie', 'Have a cookie!');
                res.redirect(process.env.CLIENT_URL);
              })
              .catch(err => {
                console.error('__ERR__:', err.message);
                res.cookie('X-401d21-Oauth-Token', '');
                res.redirect(process.env.CLIENT_URL + '?error=oauth');
              });
          });

      }
    });
};