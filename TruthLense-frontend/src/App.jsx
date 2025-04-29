import { useState } from 'react'
import './App.css'
import ChatLense from './ChatLense'
import { WelcomePage } from './WelcomePage'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
    <Routes>
      <Route path="/" element={<WelcomePage />} />
      <Route path="/chat" element={<ChatLense />} />
    </Routes>
  </Router>
  )
}

export default App
