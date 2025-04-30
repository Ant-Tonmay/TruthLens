import React, { useState } from "react";
import CreateButton from "./components/CreateButton";
import "./styles/Question_Ans.css";
const QuestionAns = ({setIsInitilized}) => {
  // const navigate = useNavigate();
  const [qaData, setQaData] = useState([
    {
      question: "What is React?",
      ragContext: "React is a JavaScript library for building user interfaces.",
      graphRagContext: "Component-based rendering and virtual DOM concepts.",
      llmResponse: "React is a frontend library developed by Meta for building UIs using a component-based architecture.",
    },
    {
      question: "What is RAG?",
      ragContext: "RAG stands for Retrieval-Augmented Generation.",
      graphRagContext: "Combines retrieval models with generative models like LLMs.",
      llmResponse: "RAG is a technique that improves LLM performance by providing external context before generating answers.",
    },
  ]);
  const [newQuestion, setNewQuestion] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;

    try {
      const response = await fetch("https://your-api-url.com/llm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: newQuestion }),
      });

      const data = await response.json();

      setQaData((prev) => [
        ...prev,
        {
          question: newQuestion,
          llmResponse: data.answer || "No response",
          ragContext: data.ragContext || "",
          graphRagContext: data.graphRagContext || "",
        },
      ]);

      setNewQuestion("");
    } catch (error) {
      console.error("Error fetching LLM response:", error);
      setQaData((prev) => [
        ...prev,
        {
          question: newQuestion,
          llmResponse: "Sorry, failed to get a response from the server.",
          ragContext: "",
          graphRagContext: "",
        },
      ]);
      setNewQuestion("");
    }
  };

  const handleChange = (e) => {
    setNewQuestion(e.target.value);
  };
  const handleNewChat=()=>{
    console.log("In New chat");
    setIsInitilized(false);
  }
  return (
    <div className="container">
      {/* Sidebar */}
      <div className="sidebar">
        <CreateButton handleClick={handleNewChat}/>
        <ul>
          <li>Chat 1</li>
          <li>Chat 2</li>
          <li>Chat 3</li>
        </ul>
      </div>

      {/* Chat area */}
      <div className="chat-area">
        <h1>Chat</h1>
        <div className="chat-messages">
          {qaData.map((item, index) => (
            <div key={index} className="chat-block">
              <div className="user-msg">
                <p><strong>You:</strong> {item.question}</p>
              </div>
              <div className="ai-msg">
                {item.ragContext && <p><strong>RAG Context:</strong> {item.ragContext}</p>}
                {item.graphRagContext && <p><strong>Graph RAG Context:</strong> {item.graphRagContext}</p>}
                <p><strong>LLM Response:</strong> {item.llmResponse}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Input form */}
        <form onSubmit={handleSubmit} className="input-form">
          <textarea
            rows={1}
            className="text-input"
            placeholder="Send a message..."
            value={newQuestion}
            onChange={handleChange}
          />
          <button type="submit" className="submit-button">➤</button>
        </form>
      </div>
    </div>
  );
};

export default QuestionAns;
