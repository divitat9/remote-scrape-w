require('dotenv').config();

const msalConfig = {
    auth: {
      clientId: process.env.CLIENT_ID,
      authority: 'https://login.microsoftonline.com/common',
      clientSecret: process.env.CLIENT_SECRET,
    },
    system: {
      loggerOptions: {
        loggerCallback(loglevel, message, containsPii) {
          console.log(message);
        },
        piiLoggingEnabled: false,
        logLevel: 'Info',
      },
    },
  };
  
  const REDIRECT_URI = 'http://localhost:3000/outlook-auth/callback';
  const POST_LOGOUT_REDIRECT_URI = process.env.POST_LOGOUT_REDIRECT_URI;
  const GRAPH_ME_ENDPOINT = process.env.GRAPH_API_ENDPOINT + "v1.0/me";
  
  module.exports = {
    msalConfig,
    REDIRECT_URI,
    POST_LOGOUT_REDIRECT_URI,
    GRAPH_ME_ENDPOINT,
  };

  