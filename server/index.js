const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'localhost:3001',
    methods: ['GET', 'POST'],
  },
});

server.listen(3000, () => {
  console.log('Server listening on port 3000');
});
