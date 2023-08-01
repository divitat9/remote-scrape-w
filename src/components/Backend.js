import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import GmailImap from './GmailImap.js';
import GmailOAuth from './GmailOAuth.js';
import OutlookOAuth from './OutlookOAuth.js';
import { msalConfig } from './AuthConfig.js';

const app = express();
const port = 3000;
const frontendPort = 3001;
const success_url = `http://localhost:${frontendPort}/success`;

app.use(cors());
app.use(express.json());

/* 
 * Google OAuth Login
 */

// Storing credentials for Google
const currentFilePath = new URL(import.meta.url).pathname;
const currentDirPath = path.dirname(currentFilePath);
const keyPath = path.join(currentDirPath, 'key.json');

const data = fs.readFileSync(path.resolve(keyPath));
const parsedData = JSON.parse(data);
const clientId = parsedData.web.client_id;
const clientSecret = parsedData.web.client_secret;
const redirectUri = parsedData.web.redirect_uris[0];

const scopesgoogle = [
  'https://mail.google.com/'
];

const googleOAuthConfig = {
  authRoute: '/google-auth',
  callbackRoute: '/google-auth/callback',
  scope: scopesgoogle,
  client_id: clientId,
  client_secret: clientSecret,
  redirect_uris: redirectUri,
  port: port,
  success_url: success_url,
};

const gmailOAuth = new GmailOAuth(app, googleOAuthConfig);
gmailOAuth.setupRoutes(); 

/* 
 * Google IMAP Login
 */

app.post('/google-imap', async (req, res) => {
  const { email, password } = req.body;
  const gmailImapConfig = { email, password }; 
  const gmailImap = new GmailImap(gmailImapConfig);
  const result = await gmailImap.initialize();

  if (result === 200) {
    res.redirect(success_url);
  } else {
    res.status(500).json({ error: "Error occurred during Google IMAP authentication and job creation." });
  }
});

/* 
 * Outlook OAuth Login
 */

const scopesoutlook = [
  'user.read'
];

const outlookOAuthConfig = {
  authRoute: '/outlook-auth',
  callbackRoute: '/outlook-auth/callback',
  scopes: scopesoutlook,
  redirectUri: 'http://localhost:3000/outlook-auth/callback',
  msalConfig: msalConfig,
  port: port, 
  success_url: success_url,
};

const outlookOAuth = new OutlookOAuth(app, outlookOAuthConfig);
outlookOAuth.setupRoutes();

/* 
 * Express Server
 */

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
