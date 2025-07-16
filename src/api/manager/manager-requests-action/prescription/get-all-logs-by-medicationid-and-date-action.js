
import { getAllLogsByMedicationIdAndDateCallback } from "@api/manager/manager-request-callback/prescription/get-all-logs-by-medicationid-and-date-calback";
import { fetchResponse } from "@api/fetch-response";

export const getAllLogsByMedicationIdAndDateAction = async (sendMedicationId, dateObj) => {
  try {

    const callback = () => getAllLogsByMedicationIdAndDateCallback(sendMedicationId, dateObj);

    const response = await fetchResponse(callback);

    // debug:
    console.log("Response from getAllLogsByMedicationIdAndDateAction:", response);

    const prescriptionLogs = await response.data || [];

    return prescriptionLogs;
    
  } catch (error) {
    console.error("Error fetching medication logs:", error);
    throw error; // Re-throw the error for further handling if needed
  }
}