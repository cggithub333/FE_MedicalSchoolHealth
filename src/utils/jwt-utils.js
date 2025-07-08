

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