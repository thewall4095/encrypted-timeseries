var client = require("socket.io-client");
var socket = client.connect("http://localhost:3000");
const sampledata = require('../data');
const encryptionService = require("./encryption");
const EMITTERINTERVAL = 10000;
const emitterService = () => {
    const startEmitter = (KEY, IV) => {
        try {
            setInterval(() => {
                const numMessages = getRandomInt(1, 2);
                console.log(numMessages, 'numMessages');
                let encryptedMessage = '';
                for (var i = 0; i < numMessages; i++) {
                    const originalMessage = {
                        name: sampledata['names'][getRandomInt(0, sampledata['names'].length)],
                        origin: sampledata['cities'][getRandomInt(0, sampledata['cities'].length)],
                        destination: sampledata['cities'][getRandomInt(0, sampledata['cities'].length)]
                    }
                    const sumCheckMessage = Object.assign(originalMessage, {
                        secret_key: encryptionService().createSHA256Hash(JSON.stringify(originalMessage))
                    });
                    // console.log(sumCheckMessage);
                    encryptedMessage += encryptionService().encrypt(KEY, IV, JSON.stringify(sumCheckMessage)).encryptedData + '|';
                }
                socket.emit('message', encryptedMessage);
            }, EMITTERINTERVAL);
        } catch (err) {
            console.log(err);
        }
    };

    return {
        startEmitter
    };
}





const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

module.exports = emitterService;
