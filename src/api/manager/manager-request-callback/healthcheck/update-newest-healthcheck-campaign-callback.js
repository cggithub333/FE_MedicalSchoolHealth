import request from "../../../request.js";

// upddate campaign status
export const updateCampaignStatus = async (campaignId, status) => {

    request.put(`management/health-check-campaigns/status/${campaignId}`,
        {
            statusHealthCampaign: status
        }
    )
};

