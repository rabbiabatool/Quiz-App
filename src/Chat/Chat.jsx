import React, { useState, useEffect } from "react";
import './Chat.css';
import Navbar from "../Navbar/Navbar";

export function Chat() {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]); // Array to store all messages
  const [myMessage, setMyMessage] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  // const [profile, setProfile] = useState("");

  useEffect(() => {
    // Create the WebSocket connection when the component mounts

    const newSocket = new WebSocket("ws://localhost:8080");

    newSocket.onopen = () => {
      console.log("Connected to WebSocket server");
    };

    newSocket.onmessage = (event) => {
      // Split the message to separate the registration number and actual message
      const [RegNo, ...msgParts] = event.data.split(' '); // Split by space
      const actualMessage = msgParts.join(' '); // Join the rest as the actual message

      // Append the new message (which includes both regNo and actualMessage) to the messages array
      setMessages((prevMessages) => [...prevMessages, { RegNo, actualMessage }]);
    };

    newSocket.onclose = () => {
      console.log("Disconnected from WebSocket server");
    };

    setSocket(newSocket);

    // Cleanup WebSocket connection when the component unmounts
    return () => newSocket.close();
  }, []);

  // useEffect(() => {
  //   setProfile(localStorage.getItem('key'))
  // }, [profile]);

  const inputHandler = (e) => {
    setMessageInput(e.target.value);
  };

  const sendMessage = () => {
    if (socket && messageInput.trim() !== "") {
      // const messageToSend = `${profile} ${messageInput}`;
      const messageToSend = `2022 ${messageInput}`;
      socket.send(messageToSend);
      setMyMessage((prev) => [...prev, messageInput]);
      setMessageInput(""); // Clear input after sending
    }
  };



  return (
    <>
      <Navbar showLogOut={false} showHome={true} showMessageLogo={false} />
      <div className="msg-div">
        <div className="heading">

          <h1 style={{ color: "black" }}>Messenger</h1>
        </div>
        <div className="container" style={{ margin: "10px" }}>

          <div className="input-div" style={{ marginTop: "20px", float: "right" }}>
            {myMessage.map((msg, index) => (

              <p key={index} className="my-msg">

                <p>{msg}</p>
              </p>
            ))}

          </div>

          {/* Render all messages as separate divs */}
          <div className="output-div" style={{ marginTop: "20px" }}>
            {messages.map((msg, index) => (
              <p key={index} className="your-msg">
                <p className="profile">2022-SE-04</p>
                {/* <p className="profile">{msg.RegNo}</p> */}
                <p>{msg}</p>
              </p>
            ))}
          </div>
        </div>
        <div className="input-btn">

          <textarea
            type="text"
            name="messageInput"
            value={messageInput}
            onChange={inputHandler}
            placeholder="Send message"
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </>
  );
}
