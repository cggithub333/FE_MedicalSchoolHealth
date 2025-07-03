import Request from "@api/request";

export const searchPupilInformationByPupilIdCallback = async (pupilId) => {
  return Request.get(`pupils/${pupilId}`);
}