import Request from "@api/request"
import { fetchResponse } from "@api/fetch-response";

const callback = async () => {
  return Request.get(`users/me`);
}

export const getMyInformation = async () => {
  try {
    const response = await fetchResponse(() => callback());

    // debug:
    // console.log("getMyInformation response:", response);

    const personalInfo = await response.data;
    
    return personalInfo;

  } catch(error) {
    throw new Error(`Error fetching personal information: ${error.message}`);
  }
}