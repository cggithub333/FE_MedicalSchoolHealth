import request from "../../../request";

// Save result campaign of pupils
export const saveResultCampaignOfPupils = async (consentId, pupils) => {
    try {
        const response = await request.post(`management/health-check/annual/result/${consentId}`, pupils);
        return response;
    } catch (error) {
        console.error("Error in saveResultCampaignOfPupils:", error);
        throw error;
    }
};