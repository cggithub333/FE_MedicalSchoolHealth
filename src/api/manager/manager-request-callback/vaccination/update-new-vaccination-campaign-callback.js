import request from "../../../request";

export const updateVaccinationCampaignStatus = async ({ campaignId, status }) => {
    if (!campaignId || !status) {
        throw new Error("Both campaignId and status are required");
    }

    return request.patch(`/api/v1/vaccination-campaigns/${campaignId}/status?status=${status}`);
};
