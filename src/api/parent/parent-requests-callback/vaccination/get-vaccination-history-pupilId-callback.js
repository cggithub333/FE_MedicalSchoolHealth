
import Request from "../../../request";


export const getVaccinationHistoryPupilIdCallback = async (pupilId) => {
  return Request.get(`/vaccination-history/pupil/${pupilId}`);
}