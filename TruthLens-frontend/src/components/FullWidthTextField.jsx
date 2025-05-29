import * as React from "react";
import sendBtn from "../assets/send.svg";
import "../styles/chat-lense.css";
export default function FullWidthTextField({ placeholder,handleSendbtn,value,inputRef}) {
  console.log(placeholder);
  return (
    <div className="full-width-input">
      <textarea placeholder={placeholder}type="text" 
        ref={inputRef}
      />
      <button className="send" onClick={handleSendbtn}>
        <img src={sendBtn} alt="send" />
      </button>
    </div>
  );
}
