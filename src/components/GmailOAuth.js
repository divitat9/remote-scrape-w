import { google } from 'googleapis';
import createJob from './createJob.js';
import encryptCreds from './encryptCreds.js';

class GmailOAuth {
  constructor(app, config) {
    this.config = config;
    this.app = app;
    this.oauth2Client = new google.auth.OAuth2(
      this.config.client_id,
      this.config.client_secret,
      this.config.redirect_uris
    );
    this.success_url = this.config.success_url;
  }

  setupRoutes() {
    this.app.get(this.config.authRoute, this.googleAuthHandler.bind(this));
    this.app.get(this.config.callbackRoute, this.googleAuthCallbackHandler.bind(this));
  }

  // Route handler that redirects user to Google auth URL generated with OAuth2 client
  googleAuthHandler(req, res) {
    const url = this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: this.config.scope
    });
    res.redirect(url);
  }

  // Callback handler for successful Google authentication
  async googleAuthCallbackHandler(req, res) {
    const { code } = req.query;
    try {
        const { tokens } = await this.oauth2Client.getToken(code);
        this.oauth2Client.setCredentials(tokens);
  
        const credential = await encryptCreds(tokens.access_token);
        await createJob("gmail-oauth", credential);
  
        res.redirect(this.success_url);
      } catch (error) {
        res.status(400).send({ error: 'Authentication failed. Please try again.' });
      }
  }
}

export default GmailOAuth;