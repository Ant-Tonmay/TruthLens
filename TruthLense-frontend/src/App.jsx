import { useState } from 'react';
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import './App.css';
import ChatLense from './ChatLense';
import QuestionAns from './QuestionAns';
import { WelcomePage } from './WelcomePage';

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
    <Routes>
      <Route path="/" element={<WelcomePage />} />
      <Route path="/chat" element={<ChatLense />} />
      <Route path="/questionAns" element={<QuestionAns/>}/>
    </Routes>
  </Router>
  )
}

export default App
