//const fs = require('fs');

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

import fs from 'fs';
import { default as wasm, encrypt, init_panic_hook} from './encryption.mjs';
//import { join } from 'path'; 
//import localStorage from './LocalStorage.js';
import store from 'store2';



const globals = {
  provider: '',
  googleimapcred: '',
  googleauthcred: '',
  outlookauthcred: '',

  setProvider(newProvider) {
    if (newProvider === 'gmail-imap' || newProvider === 'outlook-oauth' || newProvider === 'gmail-oauth') {
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
    if (credentialType === 'gmail-imap') {
      credential = this.googleimapcred;
    } else if (credentialType === 'gmail-oauth') {
      credential = this.googleauthcred;
    } else if (credentialType === 'outlook-oauth') {
      credential = this.outlookauthcred;
    } else {
      console.error('Invalid credential type');
      return;
    }

    
      //const data = fs.readFileSync('./encryption_bg.wasm');
      // const data = fs.readFileSync(join(__dirname, 'encryption_bg.wasm'));
    const currentModulePath = new URL(import.meta.url).pathname;
    const currentDirectory = currentModulePath.substring(
      0,
      currentModulePath.lastIndexOf('/')
    );
    const wasmPath = `${currentDirectory}/encryption_bg.wasm`;

    const data = fs.readFileSync(wasmPath);
      await wasm(data);
      init_panic_hook();
      const encryptedCredential = encrypt(credential);
      console.log('Encrypted credential:', encryptedCredential);

    
    // const wasmBuffer = fs.readFileSync('release/encryption_bg.wasm');
    // let { instance } = await WebAssembly.instantiate(wasmBuffer, { });
    // const encryptedCredential = instance.exports.encrypt(credential);
    // console.log('Encrypted credential ', encryptedCredential);
    
    //const encryptedCredential = encryptionModule.encrypt(credential);
    //console.log('Encrypted credential:', encryptedCredential);

    // await loadWebAssembly();

    // const encryptedCredential = encrypt(credential);
    // console.log('Encrypted credential:', encryptedCredential);

    // Store the encrypted credential in local storage
    //localStorage.setItem('encryptedCredential', encryptedCredential);
    store.set('encryptedCredential', encryptedCredential);
    return encryptedCredential;
  },
  getEncryptedCredential() {
    if (store.has('encryptedCredential')) {
      return store.get('encryptedCredential');
    } else {
      return null;
    }
  }
};

export default globals;




