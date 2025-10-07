import crypto from "crypto";

const algorithm = "aes-256-cbc";

const key = Buffer.from(process.env.ENCRYPTION_KEY!, "utf-8");
const iv = Buffer.from(process.env.ENCRYPTION_IV!, "utf-8");

export function encrypt(value: string) {
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(value, "utf-8", "hex");
  encrypted += cipher.final("hex");

  return encrypted;
}

export function decrypt(encryptedText: string) {
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encryptedText, "hex", "utf-8");
  decrypted += decipher.final("utf-8");

  return decrypted;
}
