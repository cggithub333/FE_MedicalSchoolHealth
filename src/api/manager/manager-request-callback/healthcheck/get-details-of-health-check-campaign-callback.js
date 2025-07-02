import request from "../../../request"

export const getDetailsOfHealthCheckCampaignCallback = async (campaignId) => {
    try {
        const response = await request.get(`management/health-check-campaigns/${campaignId}`);
        return response;
    } catch (error) {
        console.error("API: Request failed:", error);
        throw error;
    }
}