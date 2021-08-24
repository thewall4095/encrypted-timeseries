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

    const createSHA256Hash = (text) => {
        const hash = crypto.createHash('sha256');
        return hash.update(text, 'utf-8').digest('hex')
    }

    const compareSHA256Hash = (shatext, text) => {
        return shatext == createSHA256Hash(text);
    }

    return {
        encrypt,
        decrypt,
        createSHA256Hash,
        compareSHA256Hash
    };
}

module.exports = encryptionService;
