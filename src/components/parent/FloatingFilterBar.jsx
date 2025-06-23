import React from 'react';
import { Box, MenuItem, Select, FormControl, InputLabel } from '@mui/material';

const FloatingFilterBar = ({ childrenList = [], yearList = [] }) => {
  const [child, setChild] = React.useState('');
  const [year, setYear] = React.useState('');

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(6px)',
        borderRadius: '30px',
        boxShadow: 5,
        display: 'flex',
        gap: 2,
        padding: '12px 24px',
        zIndex: 1000,
      }}
    >
      <FormControl variant="outlined" size="small" sx={{ minWidth: 150, color: 'white' }}>
        <InputLabel sx={{ color: 'white' }}>Select Child</InputLabel>
        <Select
          value={child}
          onChange={(e) => setChild(e.target.value)}
          label="Select Child"
          sx={{
            color: 'white',
            '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: 'white',
            },
            '& .MuiSvgIcon-root': {
              color: 'white',
            },
          }}
        >
          {childrenList.map((name, index) => (
            <MenuItem key={index} value={name}>
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl variant="outlined" size="small" sx={{ minWidth: 120, color: 'white' }}>
        <InputLabel sx={{ color: 'white' }}>Select Year</InputLabel>
        <Select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          label="Select Year"
          sx={{
            color: 'white',
            '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: 'white',
            },
            '& .MuiSvgIcon-root': {
              color: 'white',
            },
          }}
        >
          {yearList.map((y, index) => (
            <MenuItem key={index} value={y}>
              {y}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default FloatingFilterBar;