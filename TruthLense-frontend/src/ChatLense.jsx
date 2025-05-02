import React, { useEffect, useRef, useState } from "react";
import FullWidthTextField from "./components/FullWidthTextField";
import QuestionAns from "./QuestionAns";
import "./styles/chat-lense.css";
import SideBar from "./components/SideBar";

const ChatLense = () => {
  const [topicName, setTopicName] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [answerData, setAnswerData] = useState([]);

  const [isInitilized, setIsInitilized] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, sender: "bot", text: "Hi there! How can I help you today?" },
  ]);
  const inputRef = useRef();

  const handleSendBtnInitilization = async (e) => {
    const queryName = inputRef.current.value;
    setIsLoading(true);
    e.preventDefault();
    setTopicName(queryName);
    try {
      const response = await fetch("http://0.0.0.0:8000/initilize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: queryName }),
      });
      if (response.status == 200) {
        localStorage.setItem(queryName,JSON.stringify([]));
        setIsLoading(false);
        setIsInitilized(true);
        
      }
    } catch (error) {
      console.log(error);
    }
  };

  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  const handleTopicClicked = (e) => {
    setIsInitilized(true);
    setIsLoading(false);

    const key = e.target.id;
    setTopicName(key);
    const previousData = localStorage.getItem(key);

    setAnswerData(JSON.parse(previousData) || []);
  };

  return (
    <>
      {isLoading && (
        <div className="animate-cont">
          <div class="wrapper">
          <div class="squre-frame"></div>
          <div class="squre-frame"></div>
          <div class="squre-frame"></div>
          <div class="squre-frame"></div>
          <div class="squre-frame"></div>
          <div class="squre-frame"></div>
          <div class="squre-frame"></div>
        </div>
        <h3>Initilization RAG and GraphRAG Pipeline</h3>
        </div>
      )}

      {!isInitilized && !isLoading && (
        <div className="init-outer">
          <SideBar
            handleTopicClicked={handleTopicClicked}
            showNewChatBtn={false}
          />
          <div className="initilization">
            <h1>What do you want to check about</h1>
            <FullWidthTextField
              placeholder="Eg : I want to check some facts about Virat Kohli"
              inputRef={inputRef}
              handleSendbtn={handleSendBtnInitilization}
            />
          </div>
        </div>
      )}
      {isInitilized && (
        <QuestionAns
          setIsInitilized={setIsInitilized}
          topicName={topicName}
          setTopicName={setTopicName}
          answerData={answerData}
          setAnswerData={setAnswerData}
        />
      )}
    </>
  );
};

export default ChatLense;
