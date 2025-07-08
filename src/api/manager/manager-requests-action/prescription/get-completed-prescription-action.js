
import { fetchResponse } from "@api/fetch-response";
import { getCompletedPrescriptionsCallback } from "@api/manager/manager-request-callback/prescription/get-completed-prescription-callback";

export const getCompletedPrescriptionsAction = async () => {
  try {
    const callback = () => getCompletedPrescriptionsCallback();

    const response = await fetchResponse(callback);

    // debug:
    // console.log("getCompletedPrescriptionsAction response:", response);

    return await response.data || []; // Return an empty array if no data is found

  } catch (error) {
    console.error("Failed to fetch completed prescriptions:", error);
    throw error;
  }
}