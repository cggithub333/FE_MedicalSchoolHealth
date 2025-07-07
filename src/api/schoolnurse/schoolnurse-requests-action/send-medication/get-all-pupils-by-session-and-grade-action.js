
import { fetchResponse } from "@api/fetch-response";
import { getAllPupilsBySessionAndGradeCallback } from "@api/schoolnurse/schoolnurse-requests-callback/send-medication/get-all-pupils-by-session-and-grade-callback";

export const getAllPupilsBySessionAndGradeAction = async (sessionId, gradeId) => {
  try {
    const callback = () => getAllPupilsBySessionAndGradeCallback(sessionId, gradeId);

    const response = await fetchResponse(callback);
    // debug:
    console.log("getAllPupilsBySessionAndGradeAction response:", response);

    const pupilsInfor = await response.data || [];

    return pupilsInfor;
  } catch (error) {
    console.error("getAllPupilsBySessionAndGradeAction error:", error);
    throw error;
  }
}