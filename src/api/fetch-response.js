
import request from "./request.js";

const fetchAPI = async (endpoints) => {

  try {
    const response = await request.get(endpoints);

    return {
      data: response.data,
      status: response.status,
    }

  } catch (error) {
    if (error.code === "ECONNABORTED") {
      console.error("Request timed out");
    } else {
      console.error("API error:", error.message);
    }
    return {
      error: error.message,
      status: false
    }
  }
}

const fetchResponse = async (syncCallbackRequest) => {

  try {
    const response = await syncCallbackRequest(); // call proper functions;

    return {
      data: response.data,
      status: response.status >= 200 && response.status < 300, // Check if status is in the range of success
    }

  } catch (error) {
    if (error.code === "ECONNABORTED") {
      console.error("Request timed out");
    } else {
      console.error("API error:", error.message);
    }
    return {
      error: error.message,
      status: false
    }
  }
}

export { fetchAPI, fetchResponse };