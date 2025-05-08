import { Add } from '@mui/icons-material';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import * as React from 'react';
import "../styles/Question_Ans.css"

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

export default function CreateButton({handleClick}) {
  return (
    <Button
     className='newchat-btn'
      component="label"
      role={undefined}
      variant="contained"
      tabIndex={-1}
      onClick={handleClick}
      startIcon={<Add />}
      sx={
        {
          margin:"5px",
          marginBottom:"50px",
          width:"100%",
          background:"#404040"
        }
      }
    >
      New Chat
    </Button>
  );
}
