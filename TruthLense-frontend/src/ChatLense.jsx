import React, { useEffect, useRef, useState } from "react";
import FullWidthTextField from "./components/FullWidthTextField";
import QuestionAns from "./QuestionAns";
import "./styles/chat-lense.css";
import SideBar from "./components/SideBar";
import AnimatedLoadingText from "./components/AnimatedLoadingText";

const ChatLense = () => {
  const [topicName, setTopicName] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [answerData, setAnswerData] = useState([]);

  const [isInitilized, setIsInitilized] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, sender: "bot", text: "Hi there! How can I help you today?" },
  ]);
  const [topicCollection, setTopicCollection] = useState([]);
  const inputRef = useRef();

  const fecthCollection = async () => {
    try {
      const response = await fetch("http://0.0.0.0:8000/entity_collection");
      if (response.status == 200) {
        // console.log(response.body)
        // console.log(typeof response.body)
        // setTopicCollection(response.body)
        const data = await response.json();
        const data_refactored = data.map((e) => e.entity_name);
        console.log(data_refactored);
        setTopicCollection(data_refactored);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fecthCollection();
  }, []);

  const handleSendBtnInitilization = async (e) => {
    const queryName = inputRef.current.value;
    setIsLoading(true);
    e.preventDefault();
    try {
      const response = await fetch("http://0.0.0.0:8000/initilize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: queryName }),
      });
      if (response.status == 200) {
        const namedEnitity = await response.json();
        setAnswerData([]);
        setIsLoading(false);
        setIsInitilized(true);
        setTopicName(namedEnitity);
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
          <AnimatedLoadingText text="Initilization RAG and GraphRAG Pipeline" />
        </div>
      )}

      {!isInitilized && !isLoading && (
        <div className="init-outer">
          <SideBar
            handleTopicClicked={handleTopicClicked}
            showNewChatBtn={false}
            heading="Frequently Asked"
            topicNames={topicCollection}
            topicName={topicName}
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
      {/* {Compononent} */}
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
