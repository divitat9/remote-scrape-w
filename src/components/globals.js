const fs = require('fs');

// let encrypt = null;

// const importObject = {
//   imports: {
//     imported_func(arg) {
//       console.log(arg);
//     },
//   },
// };

// const loadWebAssembly = async () => {
//   if (!encrypt) {
//     const wasmBuffer = fs.readFileSync(`${__dirname}/../../pkg/encryption_bg.wasm`);
//     const module = await WebAssembly.instantiate(wasmBuffer, importObject);
//     encrypt = module.instance.exports.encrypt;
//     console.log(module.instance.exports);
//   }
// };

//const encryptionModule = require(`${__dirname}/../../pkg/encryption.js`);
//const encryptionModule = require('encryption');


const globals = {
  provider: '',
  googleimapcred: '',
  googleauthcred: '',
  outlookauthcred: '',

  setProvider(newProvider) {
    if (newProvider === 'googleimap' || newProvider === 'outlookauth' || newProvider === 'googleauth') {
      this.provider = newProvider;
      console.log(this.provider);
    } else {
      console.error('Invalid provider value');
    }
  },

  getProvider() {
    return this.provider;
  },

  setImap(newimapcred) {
    this.googleimapcred = newimapcred;
    console.log(this.googleimapcred);
  },

  setGAuth(newgauthcred) {
    this.googleauthcred = newgauthcred;
    console.log(this.googleauthcred);
  },

  setOAuth(newoauthcred) {
    this.outlookauthcred = newoauthcred;
    console.log(this.outlookauthcred);
  },

  encryptCredential: async function (credentialType) {
    let credential;
    if (credentialType === 'googleimap') {
      credential = this.googleimapcred;
    } else if (credentialType === 'googleauth') {
      credential = this.googleauthcred;
    } else if (credentialType === 'outlookauth') {
      credential = this.outlookauthcred;
    } else {
      console.error('Invalid credential type');
      return;
    }
    
    const wasmBuffer = fs.readFileSync('release/encryption_bg.wasm');
    let { instance } = await WebAssembly.instantiate(wasmBuffer, { });
    const encryptedCredential = instance.exports.encrypt(credential);
    console.log('Encrypted credential ', encryptedCredential);
    
    //const encryptedCredential = encryptionModule.encrypt(credential);
    //console.log('Encrypted credential:', encryptedCredential);

    // await loadWebAssembly();

    // const encryptedCredential = encrypt(credential);
    // console.log('Encrypted credential:', encryptedCredential);

    // Store the encrypted credential in local storage
    //localStorage.setItem('encryptedCredential', encryptedCredential);
    //return encryptedCredential;
  },
};

module.exports = globals;




