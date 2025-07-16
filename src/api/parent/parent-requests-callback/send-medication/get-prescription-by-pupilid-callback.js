
import Request from "@api/request";

export const getPrescriptionByPupilIdCallback = async (pupilId) => {
  return Request.get(`send-medication/${pupilId}`);
}