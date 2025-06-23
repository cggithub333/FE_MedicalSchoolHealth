import request from "../../request";
// ✅ Use a parameter, no quotes in URL:
export const getNewestCampaignsByStatus = async () => request.get("getnewestcampaign");
