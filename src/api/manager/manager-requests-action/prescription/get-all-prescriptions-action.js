
import { fetchResponse } from "@api/fetch-response";
import { getAllPrescriptionsCallback } from "@api/manager/manager-request-callback/prescription/get-all-prescriptions-callback";

export const getAllPrescriptionsAction = async () => {
  
  try {

    const callback = () => getAllPrescriptionsCallback();
    const response = await fetchResponse(callback);

    // debug:
    // console.log("getAllPrescriptionsAction response:", response);

    return await response.data || [];

  } catch (error) {
    // console.error("Error in getAllPrescriptionsAction:", error);
    throw error; // Re-throw the error for further handling if needed
  }
}