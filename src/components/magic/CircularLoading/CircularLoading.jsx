import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

export default function CircularLoading({ message }) {
  return (
    <Box sx={styleLoadingComponent}>
      <span style={styleLoadingMsg}>{message}</span> 
      <CircularProgress />
    </Box>
  );
}

const styleLoadingComponent = {
  display: 'flex',
  gap: "10px",
  alignItems: "center"
}

const styleLoadingMsg = { 
  color: "#fff", 
  fontSize: "20px" 
}