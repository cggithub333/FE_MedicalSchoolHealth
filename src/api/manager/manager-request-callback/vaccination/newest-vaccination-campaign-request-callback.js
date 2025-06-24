import request from "../../../request.js";
// ✅ Use a parameter, no quotes in URL:
export const getNewestCampaignsByStatus = async () => request.get("newest_campaign");
