
import { getInProgressPrescriptionsCallback } from "@api/manager/manager-request-callback/prescription/get-inprogress-prescriptions-callback";
import { fetchResponse } from "@api/fetch-response";

export const getInProgressPrescriptionsAction = async () => {
  try {

    const callback = () => getInProgressPrescriptionsCallback();

    const response = await fetchResponse(callback);

    // debug:
    console.log("getInProgressPrescriptionsAction response:", response);

    return await response.data || []; // Return an empty array if no data is found

  } catch (error) {
    console.error("Failed to fetch in-progress prescriptions:", error);
    throw error;
  }
}