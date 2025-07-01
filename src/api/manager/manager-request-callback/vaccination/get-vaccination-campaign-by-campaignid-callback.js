import request from "../../../request";

export const getVaccinationCampaignByCampaignIdCallback = async (campaignId) => request.get(`vaccination-campaigns/${campaignId}`)

