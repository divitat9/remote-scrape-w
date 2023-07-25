// //JS implementation using Node.js Crypto library
var crypto = require('crypto');

export function encrypt(credential: string): string {
  const decryptionKey = 'placeholderblahblah';

  const cipher = crypto.createCipheriv('aes-256-cbc', decryptionKey, Buffer.alloc(16));
  return Buffer.concat([cipher.update(credential, 'utf8'), cipher.final()]).toString('base64');
}


// //JS implementation using CryptoJSW library
// import CryptoJSW from '@originjs/crypto-js-wasm';

// export async function encrypt(credential: string): Promise<string> {
//   const decryptionKey = 'placeholderblahblah';
//   await CryptoJSW.loadAllWasm();
//   await CryptoJSW.AES.loadWasm();
//   const iv = CryptoJSW.lib.WordArray.random(16);
//   const key = CryptoJSW.enc.Utf8.parse(decryptionKey);
//   const encrypted = CryptoJSW.AES.encrypt(credential, key, { iv }).toString();

//   return encrypted;
// }