
import { fetchResponse } from "@api/fetch-response";

import { createBulkVaccinationHistoryForEachPupilCallback } from "@api/parent/parent-requests-callback/vaccination/create-bulk-vaccination-history-for-each-pupil-callback";

export const createBulkVaccinationHistoryForEachPupilAction = async (vaccinationHistoryData) => {
  try {
    const callback = () => createBulkVaccinationHistoryForEachPupilCallback(vaccinationHistoryData);

    const response = await fetchResponse(callback);

    // debug:
    console.log("createBulkVaccinationHistoryForEachPupilAction response:", response);

  } catch (error) {
    console.error("Error in createBulkVaccinationHistoryForEachPupilAction:", error);
    throw error; // Re-throw the error to be handled by the caller
  }
}