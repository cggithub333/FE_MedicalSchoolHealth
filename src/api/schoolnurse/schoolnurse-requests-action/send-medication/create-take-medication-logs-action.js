import { fetchResponse } from "@api/fetch-response";
import { createTakeMedicationLogsCallback } from "@api/schoolnurse/schoolnurse-requests-callback/send-medication/create-take-medication-logs-callback";

export const createTakeMedicationLogsAction = async (medicationLog) => {

  try {
    const callback = () => createTakeMedicationLogsCallback(medicationLog);

    const response = await fetchResponse(callback);

    // debubg:
    console.log("POST - Create Take Medication Logs Response:", response);

  } catch (error) {
    console.error("Error creating take medication logs:", error);
    throw error; // Re-throw the error to be handled by the caller
  }
}