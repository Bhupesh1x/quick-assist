import CryptoJS from "crypto-js";

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY!;

export function encrypt(value: string) {
  const key = CryptoJS.enc.Utf8.parse(ENCRYPTION_KEY);
  const iv = CryptoJS.lib.WordArray.random(16);

  const encrypted = CryptoJS.AES.encrypt(value, key, { iv });

  // Prepend IV to ciphertext (both WordArrays)
  const encryptedWords = iv.concat(encrypted.ciphertext);

  // Encode combined data to Base64
  return CryptoJS.enc.Base64.stringify(encryptedWords);
}

export function decrypt(value: string) {
  const key = CryptoJS.enc.Utf8.parse(ENCRYPTION_KEY);
  const ivAndCiphertext = CryptoJS.enc.Base64.parse(value);

  // IV is first 16 bytes = 128 bits = 4 words
  const iv = CryptoJS.lib.WordArray.create(
    ivAndCiphertext.words.slice(0, 4),
    16
  );

  // Ciphertext is the rest
  const ciphertext = CryptoJS.lib.WordArray.create(
    ivAndCiphertext.words.slice(4),
    ivAndCiphertext.sigBytes - 16
  );

  const cipherParams = CryptoJS.lib.CipherParams.create({
    ciphertext,
  });

  const decrypted = CryptoJS.AES.decrypt(cipherParams, key, { iv });

  const plaintext = decrypted.toString(CryptoJS.enc.Utf8);

  return plaintext ?? "{}";
}
