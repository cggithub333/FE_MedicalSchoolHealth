import request from "@api/request";

export const getAllHealthRecordByPupilsCallback = async (pupilId) => request.get(`parent-health-records/pupil/${pupilId}`)