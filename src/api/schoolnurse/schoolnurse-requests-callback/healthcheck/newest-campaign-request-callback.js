import request from "../../../request";

// Get campaigns by status string

export const getCampaignsByStatus = async () => request.get("management/health-check-campaigns/allHealthCheckCampaigns")