import { fetchResponse } from "@api/fetch-response";
import { takeMedicationsByEachPupilEachSessionCallback }  from "@api/schoolnurse/schoolnurse-requests-callback/send-medication/take-medications-by-each-pupil-each-session-callback";

export const takeMedicationsByEachPupilEachSessionAction = async (sessionId, pupilId) => {

  try {
    const callback = () => takeMedicationsByEachPupilEachSessionCallback(sessionId, pupilId);

    const response = await fetchResponse(callback);
    // debug:
    console.log("Response from takeMedicationsByEachPupilEachSessionAction:", response);

    const medicationDetailsByPupil = await response.data || [];

    return medicationDetailsByPupil;
  } catch (error) {
    console.error("Error in takeMedicationsByEachPupilEachSessionAction:", error);
    throw error; // Re-throw the error to be handled by the caller
  }
}