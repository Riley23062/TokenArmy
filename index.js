import React from 'react'; // Import necessary modules from React
import io from 'socket.io-client'; // Import the socket.io client library
import axios from 'axios'; // Import axios for API requests

// Establish a socket connection to the server at the specified URL
const socket = io.connect('http://localhost:9000');

export default function App() {

  // Function to send a message
  const sendMessage = async () => {

    // Emit a socket event with the message details
    socket.emit("send_message", {
      senderId: "123",     // ID of the sender
      receiverId: "456", // ID of the receiver
      message: "Hello"   // The actual message content
    });

  }

  return 
}