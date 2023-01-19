// TODO: write server code here
const express = require("express");
const uniqid = require("uniqid");
const app = express();
const socketIO = require("socket.io");

const server = app.listen(3002);

const io = socketIO(server, {
  cors: { origin: ["http://localhost:3001"] },
});

let messages = [
  { id: uniqid(), author: "server", text: "welcome to WildChat" },
];

io.on("connect", (socket) => {
  console.log("user connected");
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  socket.emit("initialMessageList", messages);

  socket.on("messageFromClient", (messageTextAndAuthor) => {
    const newMessage = { id: uniqid(), ...messageTextAndAuthor };
    console.log("new message from a client: ", newMessage);
    messages = [...messages, newMessage];
    io.emit("allMessages", messages);
  });
});
