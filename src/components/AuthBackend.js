// const express = require('express');
// const { google } = require('googleapis');
// const open = require('open');
// const path = require('path');
// const fs = require('fs');
// const { msalConfig } = require('./AuthConfig.js');
// const {ConfidentialClientApplication } = require('@azure/msal-node');
// const axios = require('axios');
// const app = express();
// const port = 3000;
// const frontendPort = 3001;
// const globals = require('./globals');
import express from 'express';
import { google } from 'googleapis';
import open from 'open';
import path from 'path';
import fs from 'fs';
import { msalConfig } from './AuthConfig.js';
import { ConfidentialClientApplication } from '@azure/msal-node';
import axios from 'axios';

const app = express();
const port = 3000;
const frontendPort = 3001;
import globals from './globals.js';
import { create } from 'domain';


/* 
 * Google Login
 */

// Storing credentials for Google
// const keyPath = path.join(__dirname, 'key.json');
//const keyPath = './key.json';
const currentFilePath = new URL(import.meta.url).pathname;
const currentDirPath = path.dirname(currentFilePath);
const keyPath = path.join(currentDirPath, 'key.json');

let keys = { web: { redirect_uris: [''] } };

// if (fs.existsSync(keyPath)) {
//   keys = require(keyPath);
// }
if (fs.existsSync(keyPath)) {
  keys = JSON.parse(fs.readFileSync(keyPath, 'utf8'));
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
    globals.setProvider("gmail-oauth");
    globals.setGAuth(tokens.access_token);
    (async () => {
      await globals.encryptCredential("gmail-oauth");
      await createJob();
    })();
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

/* 
 * Outlook Login
 */ 

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


// Callback handler for successful Outlook authentication
app.get('/outlook-auth/callback', (req, res) => {
  const tokenRequest = {
    code: req.query.code,
    scopes: scopesoutlook,
    redirectUri: 'http://localhost:3000/outlook-auth/callback',
  };

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
    globals.setProvider("outlook-oauth");
    globals.setGAuth(response.accessToken);
    (async () => {
      await globals.encryptCredential("outlook-oauth");
      await createJob();
    })();
    res.redirect(`http://localhost:${frontendPort}/success`);
    // Make the request to the Graph API endpoint
    // axios(graphRequest).then((graphResponse) => {
    //   console.log(graphResponse.data);
    // }).catch((error) => {
    //   console.error('Error accessing Microsoft Graph API:', error);
    //   res.status(500).send('Error occurred while accessing Microsoft Graph API.');
    // });
  }).catch((error) => {
    console.error('Error acquiring token for Outlook:', error);
    res.status(500).send('Error occurred during Outlook authentication.');
  });
});

// Function to encrypt credentials and create a job
async function createJob() {
  try {
    const apiToken = process.env.API_TOKEN;
    const encryptedCreds = globals.getEncryptedCredential();
    const provider = globals.getProvider();

    const response = await fetch('https://scan.blinkreceipt.com/ereceipts/create_job', {
      method: 'POST',
      headers: {
        'api-key': apiToken,
        'uid': 1,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        'credentials': encryptedCreds,
        'provider': provider
      })
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const responseData = await response.json();
    console.log(responseData);
  } catch (error) {
    console.error(error);
  }
}

/* 
 * Express Server
 */ 

// Starts the Express server on the specified port
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
