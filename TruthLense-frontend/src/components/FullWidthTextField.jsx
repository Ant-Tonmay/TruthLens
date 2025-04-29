import * as React from "react";
import "../styles/chat-lense.css";
import sendBtn from "../assets/send.svg";
export default function FullWidthTextField({ placeholder,handleSendbtn }) {
  return (
    <div className="full-width-input">
      <input placeholder={placeholder}type="text" />
      <button className="send" onClick={handleSendbtn}>
        <img src={sendBtn} alt="send" />
      </button>
    </div>
  );
}
