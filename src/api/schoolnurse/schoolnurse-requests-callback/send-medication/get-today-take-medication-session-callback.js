
import Request from "@api/request";

export const getTodayTakeMedicationSessionCallback = async () => {
  return Request.get(`send-medication/pupil`);
}