const dotenv = require("dotenv");
const express = require("express");
const path = require('path');
const { createServer } = require("http");
const { Server } = require("socket.io");
const roomHandler = require("./roomHandler");

dotenv.config();
const app = express();

// Serve static files from the React build folder
app.use(express.static(path.join(__dirname, 'build')));

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: "*" },
});

const rooms = [];

io.on("connection", (socket) => {
  console.log("connected", socket.id);
  roomHandler(io, socket, rooms);

  socket.on("disconnect", () => {
    console.log("disconnected", socket.id);
  });
});

// Catch-all for other requests and serve the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const port = process.env.PORT || 8080;
httpServer.listen(port, () => console.log(`Listening on port ${port}`));
