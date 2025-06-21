// fetch API through an api url:

import request from "./request.js";

/* Traditional way of fetch API:
const fetchAPI = async (apiUrl) => {

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
    
  } catch(error) {
    console.error("Error fetching data: ", error);
  }
}
*/
/*Test how to get and process data;

const getData = async (endpoints) => {

  try {
    const res = await fetchAPI(endpoints);

    if (res.status === false) {
      throw new Error("FETCH API ERROR");
    }

    const data = await res.data;
    console.log(data);
  
  } catch(error) {
    console.error(error);
  }
  
}

getData("/users");

*/

/* Example:
 *   endpoints: "/users", "/blogs",..
 */
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

export { fetchAPI, fetchResponse };