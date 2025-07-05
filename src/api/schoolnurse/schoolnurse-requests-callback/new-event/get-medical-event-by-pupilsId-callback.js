import request from "@api/request";

export const getAllMedicalEventByPupilIdCallback = async (pupilId) => request.get(`medical-events/pupil/${pupilId}`)