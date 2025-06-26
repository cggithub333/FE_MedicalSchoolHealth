
import Request from '../request.js';

export const authorizeCallback = async (phoneNumber, password) => {

  console.log("login call back runned!")

  return Request.post("auth/login", {
    phoneNumber: phoneNumber,
    password: password
  });
}