import React, { useEffect, useState } from "react";
import socketIOClient from "socket.io-client";
import "./App.css";

function App() {
  const [messageList, setMessageList] = useState([]);
  const [nickName, setNickName] = useState("");
  const [newMessageText, setNewMessageText] = useState("");
  const [socket, setSocket] = useState(socketIOClient("http://localhost:3002"));

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("messageFromClient", {
      text: newMessageText,
      author: nickName,
    });
    setNewMessageText("");
  };
  socket.on("initialMessageList", (messages) => {
    setMessageList(messages);
  });
  socket.on("allMessages", (arg) => {
    setMessageList(arg);
  });
  useEffect(() => {
    console.log(messageList);
  }, [messageList]);

  return (
    <div className="App">
      <h2>Messages</h2>
      <div className="messages">
        {messageList.map((message) => {
          return (
            <div
              key={message.id}
              className={nickName === message.author ? "author" : "partner"}
            >
              <div className="username">{message.author}</div>{" "}
              <div>{message.text}</div>
            </div>
          );
        })}
      </div>
      <form onSubmit={handleSubmit}>
        <h2>New Message</h2>
        <input
          type="text"
          name="author"
          placeholder="nickname"
          value={nickName}
          required
          onChange={(e) => setNickName(e.target.value)}
        />
        <input
          type="text"
          name="messageContent"
          placeholder="message"
          value={newMessageText}
          required
          onChange={(e) => setNewMessageText(e.target.value)}
        />
        <input type="submit" value="send" />
      </form>
    </div>
  );
}

export default App;
