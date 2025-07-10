
import Request from "@api/request"
import { fetchResponse } from "@api/fetch-response";

const updateNewPasswordCallback = async(requestData) => {
  return Request.put("users/change-password", requestData);
}

export const updateNewPassword = async (requestData) => {

  try {
    const callback = () => updateNewPasswordCallback(requestData);

    const response = await fetchResponse(callback);

    // debug:
    console.log("updateNewPassword response: ", response);

    if (response.status === false) {
      throw new Error(response.message || "Failed to update password. Make sure current password is correct.");
    }
  } catch(error) {
    throw new Error(error.message || "An error occurred while updating password");
  }
}