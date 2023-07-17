// use aes::Aes256;
// use block_modes::{BlockMode, Cbc};
// use block_modes::block_padding::Pkcs7;
// use hex_literal::hex;
// use std::str;
// use std::env;
// use wasm_bindgen::prelude::*;
// use obfstr::{self, *};

// type Aes256Cbc = Cbc<Aes256, Pkcs7>;

// #[wasm_bindgen]
// pub fn encrypt(input: &str) -> String {
//     let iv = [0u8; 16];

//     //let mykey = String::from("B374A26A71490437AA024E4FADD5B497FDFF1A8EA6FF12F6FB65AF2720B59CCF");

//     obfstr! {
// 	//let mykey = "47463770474062373256694057515f75417646746845666a2d346f2e747a6f4e";
//     let mykey = "GF7pG@b72Vi@WQ_uAvFthEfj-4o.tzoN";
//     }

//     let plaintext = input.as_bytes();
//     let key = hex::decode(mykey).expect("Decoding failed");

//     let cipher = Aes256Cbc::new_from_slices(&key, &iv).unwrap();

//     let pos = plaintext.len();

//     let mut buffer = [0u8; 128];

//     buffer[..pos].copy_from_slice(plaintext);

//     let ciphertext = cipher.encrypt(&mut buffer, pos).unwrap();
//     let ciphertext_hex = hex::encode(ciphertext);
//     println!("\nCiphertext: {:?}", ciphertext_hex);
    
//     ciphertext_hex
// }








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
    let iv = [0u8; 16];

    obfstr! {
        let mykey = "GF7pG@b72Vi@WQ_uAvFthEfj-4o.tzoN";
    }

    //for hex code key
    // let plaintext = input.as_bytes();
    // let key = hex::decode(mykey).map_err(|_| "Decoding failed")?;

    //for plain text key
    let plaintext = input.as_bytes();
    let key = mykey.as_bytes();

    let cipher = Aes256Cbc::new_from_slices(&key, &iv).map_err(|_| "Cipher initialization failed")?;

    let pos = plaintext.len();

    let mut buffer = [0u8; 256];

    buffer[..pos].copy_from_slice(plaintext);

    let ciphertext = cipher.encrypt(&mut buffer, pos).map_err(|_| "Encryption failed")?;
    let ciphertext_hex = hex::encode(ciphertext);

    Ok(ciphertext_hex)
}
