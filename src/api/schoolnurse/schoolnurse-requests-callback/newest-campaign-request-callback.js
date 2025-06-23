import request from "../../request";

// Get campaigns by status string

export const getCampaignsByStatus = async (statusArray) => {
    return request.get("getallcampaign", {
        params: { status: statusArray }  // send as ?status=Published&status=InProgress
    });
};