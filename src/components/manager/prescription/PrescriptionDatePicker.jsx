import React, { useState } from 'react';
import { IconButton, Popover, Box, Typography } from '@mui/material';
import { CalendarToday } from '@mui/icons-material';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

import { useDispatch } from 'react-redux';
import { setDate, resetDate } from '@store/slices/datePickerSlice';

const PrescriptionDatePicker = () => {

  const dispatch = useDispatch();

  const [value, setValue] = useState(dayjs());
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const handleOnchange = (newValue) => {
    setValue(newValue);


    // change value of datePickerSlice in store:
    dispatch(setDate(newValue));

    //debug:
    console.log('Selected date:', newValue.format('DD/MM/YYYY'));

    /*
      Information:
      + newValue is a dayjs object
      + convert1 (Date to dayjs): newValue.toDate()
      + convert2 (dayjs to Date): newValue.toDate()
      + convert3 (dayjs to string): newValue.format('DD/MM/YYYY')
    */
    handleClose();
  }

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
            onChange={handleOnchange}
          />
        </Popover>
      </Box>
    </LocalizationProvider>
  );
}


export default PrescriptionDatePicker;