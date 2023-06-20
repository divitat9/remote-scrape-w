const express = require('express');
const { google } = require('googleapis');
const open = require('open');
const path = require('path');
const fs = require('fs');
const { msalConfig } = require('./AuthConfig.js');
const {ConfidentialClientApplication } = require('@azure/msal-node');
const axios = require('axios');
const app = express();
const port = 3000;
const frontendPort = 3001;

// -------------------------
// Google Login
// -------------------------

// Storing credentials for Google
const keyPath = path.join(__dirname, 'key.json');
let keys = { web: { redirect_uris: [''] } };

if (fs.existsSync(keyPath)) {
  keys = require(keyPath);
}

// Create a new OAuth2 client with the configured keys for Google
const googleOauth2Client = new google.auth.OAuth2(
  keys.web.client_id,
  keys.web.client_secret,
  keys.web.redirect_uris[0]
);

const scopesgoogle = [
  'https://mail.google.com/'
];

// Route handler that redirects user to Google auth URL generated with OAuth2 client
app.get('/google-auth', (req, res) => {
  const authUrl = googleOauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopesgoogle,
  });
  res.redirect(authUrl);
});

// Callback handler for successful Google authentication
app.get('/google-auth/callback', async (req, res) => {
  const { code } = req.query;
  try {
    const { tokens } = await googleOauth2Client.getToken(code);
    googleOauth2Client.setCredentials(tokens);
    res.redirect(`http://localhost:${frontendPort}/success`);
  } catch (error) {
    console.error('Error authenticating with Google:', error);
    res.status(500).send('Error occurred during Google authentication.');
  }
});

// Route handler for successful Google authentication
app.get('/google-success', (req, res) => {
  res.send('Google authentication successful! You can close this tab.');
});

// -------------------------
// Outlook Login
// -------------------------

// Create a new MSAL instance for Outlook
const pca = new ConfidentialClientApplication(msalConfig);

const scopesoutlook = [
  'user.read'
];

// Route handler for Outlook authentication
app.get('/outlook-auth', (req, res) => {
  const authCodeUrlParameters = {
    scopes: scopesoutlook,
    redirectUri: 'http://localhost:3000/outlook-auth/callback',
  };
  pca.getAuthCodeUrl(authCodeUrlParameters).then((response) => {
    res.redirect(response);
  }).catch((error) => {
    console.log(error);
    res.status(500).send('An error occurred during the Outlook authentication process.');
  });
});
console.log("here1");
// Callback handler for successful Outlook authentication
app.get('/outlook-auth/callback', (req, res) => {
  console.log("here2");
  //console.log(req);
  const tokenRequest = {
    code: req.query.code,
    scopes: scopesoutlook,
    redirectUri: 'http://localhost:3000/outlook-auth/callback',
  };

  console.log(tokenRequest);

  pca.acquireTokenByCode(tokenRequest).then((response) => {
    console.log(response.accessToken);
    // Use the acquired access token to call the Microsoft Graph API
    const graphRequest = {
      method: 'GET',
      url: 'https://graph.microsoft.com/v1.0/me',
      headers: {
        Authorization: `Bearer ${response.accessToken}`,
      },
    };

    // Make the request to the Graph API endpoint
    axios(graphRequest).then((graphResponse) => {
      console.log(graphResponse.data);
      res.redirect(`http://localhost:${frontendPort}/success`);
      res.send('Outlook authentication successful! You can close this tab.');
    }).catch((error) => {
      console.error('Error accessing Microsoft Graph API:', error);
      res.status(500).send('Error occurred while accessing Microsoft Graph API.');
    });
  }).catch((error) => {
    console.error('Error acquiring token for Outlook:', error);
    res.status(500).send('Error occurred during Outlook authentication.');
  });
});

// -------------------------
// Express Server
// -------------------------

// Starts the Express server on the specified port
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
