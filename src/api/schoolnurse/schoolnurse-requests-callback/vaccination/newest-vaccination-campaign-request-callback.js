import request from "../../../request";

// Get campaigns by status string


export const getNewestCampaignsByStatus = async () => request.get("vaccination-campaigns/all");