import React from 'react'
import Button from '@mui/joy/Button';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import { useNavigate } from 'react-router-dom';


export const WelcomePage = () => {
  const navigate = useNavigate();

  const handleGetStarted = ()=>{
         console.log("Get Stared Clicked")
         navigate("/chat")
  }
  return (
   <>
     <h1> Welcome to TruthLense </h1>
     <h2> See the what's truth </h2>
     
    
      <Button endDecorator={<KeyboardArrowRight />} color="neutral"onClick={handleGetStarted} >
        Get Started
      </Button>
    

   
   </>
  )
}
