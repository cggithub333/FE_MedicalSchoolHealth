import { Box, Avatar, Typography, keyframes } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import React from "react";

// Bell ring animation keyframes
const bellRing = keyframes`
  0%, 100% { transform: rotate(0deg); }
  10% { transform: rotate(20deg); }
  20% { transform: rotate(-16deg); }
  30% { transform: rotate(12deg); }
  40% { transform: rotate(-8deg); }
  50% { transform: rotate(4deg); }
  60% { transform: rotate(-2deg); }
  70% { transform: rotate(0deg); }
`;

const FloatingNavigateButton = ({ navigateLink, iconForAvatar, backgroundColor, textContent }) => {

  const navigate = useNavigate();

  const [ showContent, setShowContent ] = useState(false);

  const handleClick = () => {
    navigate(`${navigateLink}`);
  }

  return (
    <Box sx={{ position: "fixed", bottom: "20px", right: "30px" }}>
      <Box  sx={styleFloatNewButton}
            onMouseEnter={() => setShowContent(true)}
            onMouseLeave={() => setShowContent(false)}
            onClick={() => handleClick()}
      >
        <Avatar sx={{ 
          bgcolor: `${backgroundColor}`, 
          width: 38, 
          height: 38,
          transition: 'all 0.3s ease-in-out',
          transform: showContent ? 'rotate(90deg) scale(1.1)' : 'rotate(0deg) scale(1)',
          boxShadow: showContent ? '0 4px 12px rgba(76, 175, 80, 0.4)' : '0 2px 4px rgba(0, 0, 0, 0.1)',
          animation: showContent ? 'none' : `${bellRing} 3s ease-in-out infinite`,
          animationDelay: '1s'
        }}>
          {iconForAvatar && React.createElement(iconForAvatar, { 
            sx: { 
              transition: 'all 0.2s ease-in-out',
              fontSize: showContent ? '27px' : '23px'
            }
          })}
        </Avatar>
        <Box
          sx={{
            opacity: showContent ? 1 : 0,
            transform: showContent ? 'translateX(0)' : 'translateX(-10px)',
            transition: 'all 0.6s ease-in-out',
            fontFamily: "Open Sans, sans-serif",
            textTransform: 'uppercase',
            overflow: 'hidden',
            maxWidth: showContent ? '100px' : '0px',
          }}
        >
          <Typography  fontSize={'17px'} variant="h4" fontWeight="bold" sx={{ whiteSpace: 'nowrap' }}>
            {textContent}
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}

const styleFloatNewButton = { 
  display: "flex", 
  alignItems: "center", 
  gap: 2, 
  background: "#fff",
  padding: "10px 10px",
  borderRadius: "20px",
  cursor: "pointer",
  boxShadow: "0 2px 2px 2px rgba(0, 0, 0, 0.1)",
  transition: "all 0.5s ease-in-out",
}


export default FloatingNavigateButton;