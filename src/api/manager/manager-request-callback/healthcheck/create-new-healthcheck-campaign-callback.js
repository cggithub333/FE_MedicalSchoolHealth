import request from "../../../request.js";

// delete campaign (unfinished  - needs to be completed)
export const createNewCampaign = async (campaignData) => request.post("management/health-check-campaigns", campaignData)
