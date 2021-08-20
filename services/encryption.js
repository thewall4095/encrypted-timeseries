const crypto = require("crypto");
const ALGORITHM = "aes-256-ctr";

const encryptionService = () => {
    const encrypt = (key, iv, text) => {
        let cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(key), iv);
        let encrypted = cipher.update(text);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
    }

    const decrypt = (key, iv, text) => {
        let encryptedText = Buffer.from(text, 'hex');
        let decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(key), iv);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    }

    return {
        encrypt,
        decrypt
    };
}

module.exports = encryptionService;
