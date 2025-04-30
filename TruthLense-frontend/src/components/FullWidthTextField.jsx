import * as React from "react";
import sendBtn from "../assets/send.svg";
import "../styles/chat-lense.css";
export default function FullWidthTextField({ placeholder,handleSendbtn }) {
  console.log(placeholder);
  return (
    <div className="full-width-input">
      <input placeholder={placeholder}type="text" />
      <button className="send" onClick={handleSendbtn}>
        <img src={sendBtn} alt="send" />
      </button>
    </div>
  );
}
