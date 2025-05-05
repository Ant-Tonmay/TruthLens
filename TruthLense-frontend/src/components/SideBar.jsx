import { useState, useEffect } from "react";
import "../styles/Question_Ans.css";
import CreateButton from "./CreateButton";

const SideBar = ({
  handleTopicClicked,
  handleNewChat,
  topicName,
  showNewChatBtn = true,
  heading,
  topicNames
}) => {
 
  return (
    <div className="sidebar">
      {showNewChatBtn ? (
        <CreateButton handleClick={handleNewChat} />
      ) : (
        <h3>{heading}</h3>
      )}

      <ul>
        {topicNames.map((val,index) => ( 
          <li className={topicName===val?"active":""}
          key={index} 
            
            onClick={handleTopicClicked}
            id={val}
          >
            {val}
          </li>
        ))}
      </ul>
    </div>
  );
};
export default SideBar;
