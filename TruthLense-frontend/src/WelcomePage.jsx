import React from 'react'
import Button from '@mui/joy/Button';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import { useNavigate } from 'react-router-dom';
import "./styles/chat-lense.css"


export const WelcomePage = () => {
  const navigate = useNavigate();

  const handleGetStarted = ()=>{
         console.log("Get Stared Clicked")
         navigate("/chat")
  }
  return (
   <div className='welcome-page-outer'>
     <h1> Welcome to TruthLense </h1>
     <h2> Don't believe verify instead </h2>
     
    
      <Button endDecorator={<KeyboardArrowRight />} color="neutral"onClick={handleGetStarted} >
        Get Started
      </Button>
    

   
   </div>
  )
}
