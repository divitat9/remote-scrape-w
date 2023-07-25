use aes::Aes256;
use block_modes::{BlockMode, Cbc};
use block_modes::block_padding::Pkcs7;
use hex_literal::hex;
use obfstr::{self, *};
use wasm_bindgen::prelude::*;
extern crate console_error_panic_hook;
use console_error_panic_hook::set_once as set_panic_hook;

type Aes256Cbc = Cbc<Aes256, Pkcs7>;

#[wasm_bindgen]
pub fn init_panic_hook() {
    set_panic_hook();
}

#[wasm_bindgen]
pub fn encrypt(input: &str) -> Result<String, JsValue> {
    //Initialization vector of 0s
    let iv = [0u8; 16];

    //Obfuscate decryption key used by endpoint
    obfstr! {
        let mykey = "GF7pG@b72Vi@WQ_uAvFthEfj-4o.tzoN";
    }

    //For hex code key
    // let plaintext = input.as_bytes();
    // let key = hex::decode(mykey).map_err(|_| "Decoding failed")?;

    //For plain text key
    let plaintext = input.as_bytes();
    let key = mykey.as_bytes();

    //Create a new AES cipher
    let cipher = Aes256Cbc::new_from_slices(&key, &iv).unwrap();

    //Adjust buffer length to be closest multiple of 256 to the input length
    let pos = plaintext.len();
    let buffer_len = multiple_of_256(pos);

    let mut buffer = vec![0u8; buffer_len];

    //Copy the plaintext data to the buffer from index 0 to 'pos'
    buffer[..pos].copy_from_slice(plaintext);

    //Encrypt data in the buffer using cipher object and hex encode it
    let ciphertext = cipher.encrypt(&mut buffer, pos).unwrap();
    let ciphertext_hex = hex::encode(ciphertext);

    Ok(ciphertext_hex)
}


fn multiple_of_256(pos: usize) -> usize {
    if pos % 256 == 0 {
       return pos;
   } else {
       return (pos / 256 + 1) * 256
   }
}