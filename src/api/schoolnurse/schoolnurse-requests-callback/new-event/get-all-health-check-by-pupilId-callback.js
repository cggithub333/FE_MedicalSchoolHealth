import request from "@api/request";

export const getAllHealthCheckByPupilIdCallback = async (pupilId) => request.get(`medical-events/school-nurse/health-check/${pupilId}`);