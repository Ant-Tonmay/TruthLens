import React, { useRef, useState } from "react";
import CreateButton from "./components/CreateButton";
import "./styles/Question_Ans.css";
import FullWidthTextField from "./components/FullWidthTextField";

const QuestionAns = ({ setIsInitilized }) => {
  const inputRef = useRef();
  const [answerData, setAnswerData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newQuestion = inputRef.current.value;
    if (!newQuestion.trim()) return;

    setAnswerData((prev) => [
      ...prev,
      { type: "question", data: newQuestion },
      {
        type: "response",
        data: "",
        ragContext: [],
        graphRagContext: [],
      },
    ]);
    setIsLoading(true);
    inputRef.current.value = "";

    try {
      const response = await fetch("http://0.0.0.0:8000/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: newQuestion }),
      });

      const data = await response.json();

      const ragWords = (data.rag_context || []).join(" ").split(" ");
      const graphWords = (data.graphrag_context || []).join(" ").split(" ");
      const responseWords = (data.llm_response || "No response").split(" ");

      let ragIndex = 0;
      let graphIndex = 0;
      let responseIndex = 0;

      const updateData = {
        type: "response",
        data: "",
        ragContext: [],
        graphRagContext: [],
      };

      setAnswerData((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = updateData;
        return updated;
      });

      const interval = setInterval(() => {
        setAnswerData((prev) => {
          const updated = [...prev];
          const last = { ...updated[updated.length - 1] };

          if (ragIndex < ragWords.length) {
            last.ragContext.push(ragWords[ragIndex]);
            ragIndex++;
          } else if (graphIndex < graphWords.length) {
            last.graphRagContext.push(graphWords[graphIndex]);
            graphIndex++;
          } else if (responseIndex < responseWords.length) {
            last.data += responseWords[responseIndex] + " ";
            responseIndex++;
          } else {
            clearInterval(interval);
            setIsLoading(false);
          }

          updated[updated.length - 1] = last;
          return updated;
        });
      }, 80); // speed: lower = faster

    } catch (error) {
      setAnswerData((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          type: "response",
          data: "Sorry, failed to get a response from the server.",
          ragContext: [],
          graphRagContext: [],
        };
        return updated;
      });
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    setIsInitilized(false);
  };

  return (
    <div className="container">
      {/* Sidebar */}
      <div className="sidebar">
        <CreateButton handleClick={handleNewChat} />
        <ul>
          <li>Chat 1</li>
          <li>Chat 2</li>
          <li>Chat 3</li>
        </ul>
      </div>

      {/* Chat area */}
      <div className="chat-area">
        <h1>Truth Lense</h1>
        {answerData.length === 0 && (
          <div className="no-message-div">
            <h1>What's on your mind ?</h1>
          </div>
        )}

        <div className="chat-messages">
          {answerData.map((item, index) => {
            const isLast = index === answerData.length - 1;

            return (
              <div key={index} className="chat-block">
                {item.type === "question" && (
                  <div className="user-msg">
                    <p>
                      <strong>You:</strong> {item.data}
                    </p>
                  </div>
                )}

                {item.type === "response" && (
                  <div className="ai-msg">
                    {item.ragContext && item.ragContext.length > 0 && (
                      <div className="rag-context">
                        <strong>RAG Context:</strong>
                        <pre
                          style={{
                            background: "#1B1212",
                            padding: "0.5rem",
                            borderRadius: "6px",
                            whiteSpace: "pre-wrap",
                          }}
                        >
                          {item.ragContext.join(" ")}
                        </pre>
                      </div>
                    )}
                    {item.graphRagContext &&
                      item.graphRagContext.length > 0 && (
                        <div className="graph-rag-context">
                          <strong>Graph RAG Context:</strong>
                          <pre
                            style={{
                              background: "#1B1212",
                              padding: "0.5rem",
                              borderRadius: "6px",
                              whiteSpace: "pre-wrap",
                            }}
                          >
                            {item.graphRagContext.join(" ")}
                          </pre>
                        </div>
                      )}

                    {isLast && isLoading ? (
                      <section>
                        <div className="loading loading08">
                          <span data-text="T">T</span>
                          <span data-text="H">H</span>
                          <span data-text="I">I</span>
                          <span data-text="N">N</span>
                          <span data-text="K">K</span>
                          <span data-text="I">I</span>
                          <span data-text="N">N</span>
                          <span data-text="G">G</span>
                        </div>
                      </section>
                    ) : (
                      item.data && (
                        <p>
                          <strong>Conclusion :</strong> {item.data}
                        </p>
                      )
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Input */}
        <FullWidthTextField
          placeholder="Enter your Query"
          inputRef={inputRef}
          handleSendbtn={handleSubmit}
        />
      </div>
    </div>
  );
};

export default QuestionAns;
