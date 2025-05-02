import { useState, useEffect } from "react";
import "../styles/Question_Ans.css";
import CreateButton from "./CreateButton";

const SideBar = ({
  handleTopicClicked,
  handleNewChat,
  topicName,
  showNewChatBtn = true,
}) => {
  const [topicNames, setTopicNames] = useState([]);
  useEffect(() => {
    const temp = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i); // Get the key at index i
      const value = localStorage.getItem(key); // Get the value of that key
      temp.push(key);
    }
    if(topicName)
        setTopicNames([topicName, ...temp]);
    else setTopicNames(temp)
  }, [topicName]);

  return (
    <div className="sidebar">
      {showNewChatBtn ? (
        <CreateButton handleClick={handleNewChat} />
      ) : (
        <h3>Your History</h3>
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
