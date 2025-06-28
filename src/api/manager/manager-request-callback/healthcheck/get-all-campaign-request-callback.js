import request from "../../../request.js";
// Get all health check campaigns
export const getAllCampaigns = async () => request.get("management/health-check-campaigns/allHealthCheckCampaigns");


