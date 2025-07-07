import { createSlice } from '@reduxjs/toolkit';

const counterSlice = createSlice({
  name: 'counter',
  initialState: {
    value: 0, // Can be any data structure
  },
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload;
    },
  },
});

// Export actions to use in components
export const { increment, decrement, incrementByAmount } = counterSlice.actions;

// Export reducer to register in the store
export default counterSlice.reducer;