import express from 'express';
import { google } from 'googleapis';
import open from 'open';
import path from 'path';
import fs from 'fs';
import { msalConfig } from './AuthConfig.js';
import { ConfidentialClientApplication } from '@azure/msal-node';
import axios from 'axios';
import cors from 'cors';

const app = express();
const port = 3000;
const frontendPort = 3001;
import globals from './globals.js';
import { create } from 'domain';
import store from 'store2';
app.use(cors());
app.use(express.json());


/* 
 * Google OAuth Login
 */

// Storing credentials for Google
const currentFilePath = new URL(import.meta.url).pathname;
const currentDirPath = path.dirname(currentFilePath);
const keyPath = path.join(currentDirPath, 'key.json');

let keys = { web: { redirect_uris: [''] } };

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
      await createJob("gmail-oauth");
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
 * Google IMAP Login
 */

app.post('/google-imap', async (req, res) => {
  //Receive credentials from front end and set them in globals
  const { email, password } = req.body;

  globals.setProvider("gmail-imap");
  globals.setImap(email + ":" + password);

  try {
    // Encrypt the credentials
    await globals.encryptCredential("gmail-imap");

    // Create a job
    await createJob("gmail-imap");

    res.status(200).json({ message: "Google IMAP authentication and job creation successful!" });
  } catch (error) {
    console.error("Error occurred during Google IMAP authentication and job creation:", error);
    res.status(500).json({ error: "Error occurred during Google IMAP authentication and job creation." });
  }
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
    // Use the acquired access token to create job
    globals.setProvider("outlook-oauth");
    globals.setOAuth(response.accessToken);
    (async () => {
      await globals.encryptCredential("outlook-oauth");
      await createJob("outlook-oauth");
    })();
    res.redirect(`http://localhost:${frontendPort}/success`);
  }).catch((error) => {
    console.error('Error acquiring token for Outlook:', error);
    res.status(500).send('Error occurred during Outlook authentication.');
  });
});

/* 
 * Create Job
 */ 

// Function to encrypt credentials and create a job
async function createJob(provider) {
  try {
    const apiToken = process.env.API_TOKEN;
    const encryptedCreds = globals.getEncryptedCredential();

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

//Handling Relogins
app.get('/relogin', async (req, res) => {
  try {
    const storedCredential = globals.getEncryptedCredential();
    res.json({ encryptedCredential: storedCredential });
  } catch (error) {
    console.error('Error occurred during API request handling:', error);
    res.status(500).json({ error: 'Error occurred during API request handling.' });
  }
});

/* 
 * Express Server
 */ 

// Starts the Express server on the specified port
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
