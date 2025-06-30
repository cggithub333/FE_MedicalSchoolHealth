import request from "../../../request"

export const getDetailsOfHealthCheckCampaignCallback = async (campaignId) => {
    console.log("API: Calling campaign details for ID:", campaignId);
    try {
        const response = await request.get(`management/health-check-campaigns/${campaignId}`);
        console.log("API: Raw response:", response);
        return response;
    } catch (error) {
        console.error("API: Request failed:", error);
        throw error;
    }
}