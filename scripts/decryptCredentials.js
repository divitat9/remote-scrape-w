import fs from 'fs';
import BRCrypto from './BRCrypto.js';
console.log(BRCrypto.decryptCreds(fs.readFileSync(0, 'utf-8')));