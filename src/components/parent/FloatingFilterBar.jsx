import React from 'react';
import { Box, MenuItem, Select, FormControl, InputLabel } from '@mui/material';

import { Base64} from 'js-base64'

const FloatingFilterBar = ({ pupils = [], yearList = [] }) => {
  const [childName, setChildName] = React.useState('');
  const [year, setYear] = React.useState('');

  const handleChildChange = (event) => {
    setChildName(event.target.value);
  }

  const handleChildOptionClick = (event, pupil) => {
    // store pupilId, pupilName, pupilInfor in localStorage:
    localStorage.setItem('pupilId', pupil.pupilId); // assuming pupilId is the unique identifier
    localStorage.setItem('pupilName', `${pupil.lastName} ${pupil.firstName}`);
    localStorage.setItem('pupilGender', pupil.gender);
    localStorage.setItem('pupilInfo', Base64.encode(JSON.stringify(pupil))); // store the whole
    setChildName(`${pupil.lastName} ${pupil.firstName}`); // update the displayed name
    location.reload(); // reload the page to reflect changes
  }

  const handleYearOptionClick = (event, year) => {
    // store selected year in localStorage:
    localStorage.setItem('healthCheckYear', year);
    setYear(year);
    location.reload(); // reload the page to reflect changes
  }

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
        <InputLabel sx={{ color: 'white' }}>{(localStorage.getItem('pupilName') ? localStorage.getItem('pupilName') : 'Select Child')}</InputLabel>
        <Select
          value={childName}
          onChange={handleChildChange}
          label={(localStorage.getItem('pupilName') ? localStorage.getItem('pupilName') : 'Select Child')}
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
          {pupils.map((pupil, index) => (
            <MenuItem onClick={(e) => handleChildOptionClick(e, pupil)} key={index} value={pupil.pupilId}> {/* marked for pupilId value change */}
              {`${pupil.lastName} ${pupil.firstName}`}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl variant="outlined" size="small" sx={{ minWidth: 120, color: 'white' }}>
        <InputLabel sx={{ color: 'white' }}>
          {localStorage.getItem('healthCheckYear') ? localStorage.getItem('healthCheckYear') : 'Select Year'}
        </InputLabel>
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
            <MenuItem onClick={(e) => handleYearOptionClick(e, y)} key={index} value={y}>
              {y}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default FloatingFilterBar;