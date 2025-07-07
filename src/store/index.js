import { configureStore } from '@reduxjs/toolkit';
import { devToolsEnhancer } from '@redux-devtools/extension';

import counterReducer from './slices/counterSlice';
import datePickerReducer from './slices/datePickerSlice';

const store = configureStore({
  reducer: {
    counter: counterReducer, // Add more slices here as needed
    datePicker: datePickerReducer, // Date picker slice
  },
  devTools: false, // <-- disable built-in DevTools
  enhancers: (getDefaultEnhancers) => [
    ...getDefaultEnhancers(),
    devToolsEnhancer(),
  ],
});

export default store;