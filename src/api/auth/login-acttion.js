
import { authorizeCallback } from "./login-callback";

import { fetchResponse } from "../fetch-response";

export const authorizeAction = async (phoneNumber, password) => {


  console.log("login action runned");

  try {

    const callback = () => authorizeCallback(phoneNumber, password);
    const response = await fetchResponse(callback);

    if (response.status === false)  {
      console.error("Login failed!");
    }

    const logicSuccessData = await response.data;

    const JWTToken = logicSuccessData.token;
    const userRole = logicSuccessData.role;
    const userFullName = logicSuccessData.fullName

    // store into local storage:
    localStorage.setItem('jwtToken', JWTToken);
    localStorage.setItem('userRole', userRole);
    localStorage.setItem('userFullName', userFullName);
  }
  catch(error) {
    console.log("Login failed!");
    throw error;
  }
}