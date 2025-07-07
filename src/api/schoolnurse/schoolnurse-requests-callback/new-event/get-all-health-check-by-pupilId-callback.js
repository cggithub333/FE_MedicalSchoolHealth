import request from "@api/request";

export const getAllHealthCheckByPupilIdCallback = async (pupilId) => request.get(`management/health-check-campaigns/allHealthCheckCampaignsByPupilId/${pupilId}`);

