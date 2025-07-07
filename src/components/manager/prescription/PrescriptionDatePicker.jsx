import React, { useState } from 'react';
import { IconButton, Popover, Box, Typography } from '@mui/material';
import { CalendarToday } from '@mui/icons-material';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

const PrescriptionDatePicker = () => {
  const [value, setValue] = useState(dayjs());
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box display="flex" alignItems="center" gap={1}>
        <Typography>{value.format('DD/MM/YYYY')}</Typography>
        <IconButton onClick={handleOpen}>
          <CalendarToday />
        </IconButton>
        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        >
          <DateCalendar
            value={value}
            onChange={(newValue) => {
              setValue(newValue);
              handleClose();
            }}
          />
        </Popover>
      </Box>
    </LocalizationProvider>
  );
}


export default PrescriptionDatePicker;