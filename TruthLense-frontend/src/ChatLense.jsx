import React, { useState, useRef, useEffect } from "react";
import "./styles/chat-lense.css";
import FullWidthTextField from "./components/FullWidthTextField";

const ChatLense = () => {
  const [isSendButtonClicked, setIsSendButtonClicked] = useState(false);
  const [isInitilized,setIsInitilized] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, sender: "bot", text: "Hi there! How can I help you today?" },
  ]);

  const handleSendBtnInitilization = ()=>{
    setIsInitilized(true);
  }

  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);

  const sendMessage = () => {
    if (input.trim() === "") return;
    setIsSendButtonClicked(true);

    const userMessage = { id: Date.now(), sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Simulate bot response
    setTimeout(() => {
      const botMessage = {
        id: Date.now() + 1,
        sender: "bot",
        text: "This is a simulated response.",
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 800);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <>

      {
        !isInitilized &&
        <div className="initilization">
         <h1>What do you want to check about</h1>
          <FullWidthTextField 
          placeholder="Eg : I want to check some facts about Virat Kohli"
          handleSendbtn={handleSendBtnInitilization}
          />

      </div>
      }
      {isInitilized&&
        <h1> impement this</h1>
      }
    </>
  );
};

export default ChatLense;
