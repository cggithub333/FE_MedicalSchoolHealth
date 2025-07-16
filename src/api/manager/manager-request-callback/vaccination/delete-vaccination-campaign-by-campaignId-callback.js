import request from "@api/request";

export const deleteVaccinationCampaign = async (campaignId) => request.delete(`vaccination-campaigns/${campaignId}`)
