
import { createSlice } from '@reduxjs/toolkit';

const personalInforSlice = createSlice({
  name: 'personalInfor',
  initialState: {
    information : {
      userId: "",
      lastName: "",
      firstName: "",
      birthDate: "",
      email: "",
      phoneNumber: "",
      createdAt: "",
      role: ""
    }
  },
  reducers: {
    setPersonalInfo: (state, action) => {
      if (!action.payload)
        return state;

      const newInformation = action.payload;
      return {
        ...state,
        information: {
          ...state.information,
          userId: newInformation.userId || state.information.userId,
          lastName: newInformation.lastName || state.information.lastName,
          firstName: newInformation.firstName || state.information.firstName,
          birthDate: newInformation.birthDate || state.information.birthDate,
          email: newInformation.email || state.information.email,
          phoneNumber: newInformation.phoneNumber || state.information.phoneNumber,
          createdAt: newInformation.createdAt || state.information.createdAt,
          role: newInformation.role || state.information.role
        }
      };
    },
    clearPersonalInfo: (state) => {
      return {
        ...state,
        information: {
          userId: "",
          lastName: "",
          firstName: "",
          birthDate: "",
          email: "",
          phoneNumber: "",
          createdAt: "",
          role: ""
        }
      }
    }
  }
});

export const isEmptyPersonalInfo = (state) => {
  const infor = state.personalInfor.information;
  if (!infor) return true;
  return  !infor.userId && !infor.lastName &&
          !infor.firstName && !infor.birthDate &&
          !infor.email && !infor.phoneNumber &&
          !infor.createdAt && !infor.role;
}

export const { setPersonalInfo, clearPersonalInfo } = personalInforSlice.actions;
export default personalInforSlice.reducer;