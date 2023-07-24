import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();
//this is the same key that is hardcoded and obfuscated in the mobile SDKs
const decryptionKey = process.env.ERECEIPTS_DECRYPTION_KEY || 'f21177bb92130cd2bb8c3ff8985c6b85';


const BRCrypto = { 
    encryptCreds: (credentials) => {
        const cipher = crypto.createCipheriv('aes-256-cbc', decryptionKey, Buffer.alloc(16));
        return Buffer.concat([cipher.update(credentials, 'utf8'), cipher.final()]).toString('base64');
    },
    decryptCreds: (encryptedCreds) => {
        let decryptedCreds = null;
        try {
            const decipher = crypto.createDecipheriv('aes-256-cbc', decryptionKey, Buffer.alloc(16));
            decryptedCreds = decipher.update(encryptedCreds, 'base64') + decipher.final();
        } catch (exc) {
            //BRUtils.log("Error attempting to decrypt credentials: " + encryptedCreds + "\nException: " + exc);
        }
        return decryptedCreds;
    }
} 

export default BRCrypto;
