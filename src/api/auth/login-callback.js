
import Request from '../request.js';

export const authorizeCallback = async (phoneNumber, password) => {


  return Request.post("auth/login", {
    phoneNumber: phoneNumber,
    password: password
  });
}