import request from "../../../request";

export const publishVaccinationCampaignStatus = async (campaignId) => request.patch(`vaccination-campaigns/${campaignId}/publish`);
