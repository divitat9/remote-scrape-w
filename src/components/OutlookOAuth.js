import { ConfidentialClientApplication } from '@azure/msal-node';
import createJob from './createJob.js';
import encryptCreds from './encryptCreds.js';

class OutlookOAuth {
  constructor(app, config) {
    this.config = config;
    this.app = app;
    this.cca = new ConfidentialClientApplication(this.config.msalConfig);
    this.success_url = this.config.success_url;
  }

  setupRoutes() {
    this.app.get(this.config.authRoute, this.outlookAuthHandler.bind(this));
    this.app.get(this.config.callbackRoute, this.outlookAuthCallbackHandler.bind(this));
  }

  // Route handler for Outlook that redirects user to auth URL generated with CCA
  async outlookAuthHandler(req, res) {
    const authCodeUrlParameters = {
      scopes: this.config.scopes,
      redirectUri: this.config.redirectUri,
    };
    try {
      const response = await this.cca.getAuthCodeUrl(authCodeUrlParameters);
      res.redirect(response);
    } catch (error) {
      console.error(error);
      res.status(400).send('An error occurred during the Outlook authentication process.');
    }
  }

  // Callback handler for successful Outlook authentication
  async outlookAuthCallbackHandler(req, res) {
    const tokenRequest = {
      code: req.query.code,
      scopes: this.config.scopes,
      redirectUri: this.config.redirectUri,
    };

    try {
      const response = await this.cca.acquireTokenByCode(tokenRequest);
      const credential = await encryptCreds(response.accessToken);
      await createJob("outlook-oauth", credential);
      res.redirect(this.success_url);
    } catch (error) {
      res.status(400).send('Error occurred during Outlook authentication.');
    }
  }
}

export default OutlookOAuth;