
import dayjs from 'dayjs';
import { createSlice } from '@reduxjs/toolkit';

const datePickerSlice = createSlice({
  name: "datePicker",
  initialState: {
    value: dayjs().toISOString(), // Initialize with the current date
  },
  reducers: {
    setDate: (state, action) => {
      return {
        ...state,
        value: dayjs(action.payload).toISOString(), // Update the date with the provided value
      }
    },
    resetDate: (state) => {
      return {
        ...state,
        value: dayjs().toISOString(), // Reset to the current date
      }
    },
  },
});

export const { setDate, resetDate } = datePickerSlice.actions;
export default datePickerSlice.reducer;