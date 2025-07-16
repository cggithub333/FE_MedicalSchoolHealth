
import { getTodayTakeMedicationSessionCallback } from "@api/schoolnurse/schoolnurse-requests-callback/send-medication/get-today-take-medication-session-callback";
import { fetchResponse } from "@api/fetch-response";

export const getTodayTakeMedicationSessionAction = async () => {
  
  try {
    const callback = () => getTodayTakeMedicationSessionCallback();

    const response = await fetchResponse(callback);
    // debug:
    // console.log("getTodayTakeMedicationSessionAction response:", response);

    const sessionsInfor = await response.data || [];

    return response.data;
  } catch (error) {
    console.error("getTodayTakeMedicationSessionAction error:", error);
    throw error;
  }
}