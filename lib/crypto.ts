import * as CryptoJS from "crypto-js";

export function encryptResponse(responseBody: string, key: string) {
  const iv = CryptoJS.lib.WordArray.random(16);
  const decodedKey = CryptoJS.enc.Base64.parse(key);

  const encrypted = CryptoJS.AES.encrypt(
    CryptoJS.enc.Utf8.parse(responseBody),
    decodedKey,
    {
      iv,
      padding: CryptoJS.pad.Pkcs7,
      mode: CryptoJS.mode.CBC,
    }
  );

  const combined = iv.concat(encrypted.ciphertext);
  return CryptoJS.enc.Base64.stringify(combined);
}

export function decryptRequest(encryptedString: string, key: string) {
  const byteCipherText = CryptoJS.enc.Base64.parse(encryptedString);

  const iv = CryptoJS.lib.WordArray.create(
    byteCipherText.words.slice(0, 4),
    16
  );
  const cipherText = CryptoJS.lib.WordArray.create(
    byteCipherText.words.slice(4),
    byteCipherText.sigBytes - 16
  );

  const decodedKey = CryptoJS.enc.Base64.parse(key);

  const decrypted = CryptoJS.AES.decrypt(
    CryptoJS.lib.CipherParams.create({ ciphertext: cipherText }),
    decodedKey,
    {
      iv,
      padding: CryptoJS.pad.Pkcs7,
      mode: CryptoJS.mode.CBC,
    }
  );

  return decrypted.toString(CryptoJS.enc.Utf8);
}
