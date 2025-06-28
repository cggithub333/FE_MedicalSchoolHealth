import { fetchResponse } from "../../../fetch-response";
import { publishVaccinationCampaignStatus } from "../../manager-request-callback/vaccination/publish-new-vaccination-campaign-callback.js";

export const publishNewVaccinationCampaign = async (campaignId) => {
    try {
        const response = await publishVaccinationCampaignStatus(campaignId);
        return fetchResponse(response);
    } catch (error) {
        console.error("Error publishing vaccination campaign:", error);
        throw error;
    }
}