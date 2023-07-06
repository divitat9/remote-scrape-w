use aes::Aes256;
use block_modes::{BlockMode, Cbc};
use block_modes::block_padding::Pkcs7;
use hex_literal::hex;
use std::str;
use std::env;
use wasm_bindgen::prelude::*;
use obfstr::{self, *};

type Aes256Cbc = Cbc<Aes256, Pkcs7>;

#[wasm_bindgen]
pub fn encrypt(input: &str) -> String {
    let iv = [0u8; 16];

    let mykey = String::from("f21177bb92130cd2bb8c3ff8985c6b85");
    let plaintext = input.as_bytes();
    let key = hex::decode(mykey).expect("Decoding failed");

    let cipher = Aes256Cbc::new_from_slices(&key, &iv).unwrap();

    let pos = plaintext.len();

    let mut buffer = [0u8; 128];

    buffer[..pos].copy_from_slice(plaintext);

    let ciphertext = cipher.encrypt(&mut buffer, pos).unwrap();
    let ciphertext_hex = hex::encode(ciphertext);
    println!("\nCiphertext: {:?}", ciphertext_hex);
    
    ciphertext_hex
}






