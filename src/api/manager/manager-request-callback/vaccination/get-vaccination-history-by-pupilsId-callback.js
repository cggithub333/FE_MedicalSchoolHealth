import request from "../../../request";

export const getVaccinationHistoryByPupilsIdCallback = async (pupilId) => request.get(`vaccination-history/pupil/${pupilId}`)