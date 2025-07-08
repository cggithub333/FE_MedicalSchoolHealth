
import { createSlice } from "@reduxjs/toolkit";

const prescriptionSlice = createSlice({
  name: "prescription",
  initialState: {
    selectedPrescription: null,
  },
  reducers: {
    setSelectedPrescription(state, action) {
      return {  
        ...state, 
        selectedPrescription: action.payload  
        //Cuong's message: keep old state, and update the property. => this help change the reference of the state object
        // This is important for React to detect changes and re-render components that depend on this state
      };
    },
    resetSelectedPrescription(state) {
      return {
        ...state,
        selectedPrescription: null, // Reset the selected prescription to null
      }
    }
  },
});

export const { setSelectedPrescription, resetSelectedPrescription } = prescriptionSlice.actions;
export default prescriptionSlice.reducer;