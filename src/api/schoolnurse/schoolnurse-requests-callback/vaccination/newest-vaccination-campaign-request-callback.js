import request from "../../../request";

// Get campaigns by status string


export const getNewestCampaignsByStatus = async () => request.get("newest_vaccination_campaign");