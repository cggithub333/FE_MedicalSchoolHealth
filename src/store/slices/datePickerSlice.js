
import dayjs from 'dayjs';
import { createSlice } from '@reduxjs/toolkit';

const datePickerSlice = createSlice({
  name: "datePicker",
  initialState: {
    value: dayjs(),
  },
  reducers: {
    setDate: (state, action) => {
      state.value = action.payload;
    },
    resetDate: (state) => {
      state.value = dayjs();
    },
  },
});

export const { setDate, resetDate } = datePickerSlice.actions;
export default datePickerSlice.reducer;