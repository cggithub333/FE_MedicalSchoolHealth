
import Request from "@api/request";

export const takeMedicationsByEachPupilEachSessionCallback = async (sessionId, pupilId) => {

  return Request.get(`send-medication/detailPupil/${pupilId}/session/${sessionId}`);
}