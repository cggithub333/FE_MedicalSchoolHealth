

import { Base64 } from "js-base64";

export const getPayloadStr = () => {
  const jwtToken = localStorage.getItem('jwtToken');
  if (!jwtToken) {
    throw new Error("getPayloadStr(jwtToken): - JwtToken is null!")
  }
  //else:
  const payloadPart = jwtToken.split('.')[1];
  return Base64.decode(payloadPart);  
}

export const getPayloadResources = () => {

  try {
    const payloadStr = getPayloadStr();
    const payload = JSON.parse(payloadStr);

    return payload;
  
  } catch(error) {
    console.log("getPayloadResources() error: ", error);
    return {
      error: error
    }
  }
}

export const getJWTToken = () => {
  const token = localStorage.getItem('jwtToken');
  console.log("getJWTToken() -> JWT Token: " + token);
  return token; 
}

export const isExpiredToken = () => {
  const currentSeconds = Math.floor(Date.now() / 1000);
  const { exp, error } = getPayloadResources() || {};
  
  if (!exp || error) {
    console.error("Session expired: 'exp' is not defined in the JWT payload.");
    return true; // consider it expired if exp is not defined
  }

  return currentSeconds >= exp;
}