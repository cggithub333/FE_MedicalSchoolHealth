
import Request from "@api/request";

export const getAllPupilsBySessionAndGradeCallback = async (sessionId, gradeId) => {

  return Request.get(`send-medication/pupil/session?session=${sessionId}&grade=${gradeId}`);
}