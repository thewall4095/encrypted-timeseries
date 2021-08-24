const express = require("express");
const logger = require("morgan");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const cors = require("cors");
const app = express();
const http = require('http');
const socketIO = require('socket.io');
const crypto = require("crypto");
// Exported routers
const routers = require("./routes/index");

//for crypto
const KEY = crypto.randomBytes(32);
const IV = crypto.randomBytes(16);

const emitterService = require("./services/emitter");
const encryptionService = require("./services/encryption");
const dbService = require("./services/db");
const dbOperationService = require("./services/db_operation");



const bodyParserLimit = "100mb";

const server = http.createServer(app);
let io = socketIO(server, {
  cors: {
    origin: "https://aureal.one",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }
});
//Middlewares
app.use(logger("combined"));
app.use(bodyParser.json({ limit: bodyParserLimit }));
app.use(bodyParser.urlencoded({ extended: false, limit: bodyParserLimit }));
app.use(helmet());
app.use(cors());

// Routes
routers.forEach((router) => {
  app.use(router.path, router.handler);
});


io.on('connection', (socket) => {

  console.log('auserconnected');

  socket.on('disconnect', () => {
    console.log('userdisconnected');
  });

  socket.on('message', (msg) => {
    // dbOperationService().insertToDB();
    const encryptedMessages = msg.split('|');
    const numMessages = encryptedMessages.length - 1; //since last element will be ''
    console.log(numMessages, 'numMessages');
    let decryptedMessages = [];
    for (var i = 0; i < numMessages; i++) {
      const decryptedMessage = JSON.parse(encryptionService().decrypt(KEY, IV, encryptedMessages[i]));
      const originalMessage = {
        name:decryptedMessage.name,
        origin:decryptedMessage.origin,
        destination:decryptedMessage.destination
      }
      // console.log(decryptedMessage, JSON.stringify(originalMessage))
      // console.log(decryptedMessage.secret_key, decryptedMessage, originalMessage)
      if(encryptionService().compareSHA256Hash(decryptedMessage.secret_key, JSON.stringify(originalMessage)))
        decryptedMessages.push(originalMessage)
    }
    // console.log('message: ' + JSON.stringify(decryptedMessages));
    dbOperationService().insertToDB(decryptedMessages);
  });
});

dbService().connectDB();
emitterService().startEmitter(KEY, IV);
//Start server
const port = process.env.MAIN_PORT || 3000;
server.listen(port, () => console.log(`Listening on port ${port}`));
