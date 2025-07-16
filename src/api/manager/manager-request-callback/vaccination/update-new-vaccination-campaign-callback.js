import request from "../../../request";

export const updateVaccinationCampaignStatus = async ({ campaignId, status }) => {
    return request.patch(`vaccination-campaigns/${campaignId}/status`, null, {
        params: { status },
    });
};
