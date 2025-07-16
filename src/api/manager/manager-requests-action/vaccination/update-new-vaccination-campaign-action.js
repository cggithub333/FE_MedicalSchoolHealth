import { fetchResponse } from "../../../fetch-response";
import { updateVaccinationCampaignStatus } from "../../manager-request-callback/vaccination/update-new-vaccination-campaign-callback";

export const updateVaccinationCampaignStatusAction = async ({ campaignId, status }) => {
    try {
        const response = await updateVaccinationCampaignStatus({ campaignId, status });
        return fetchResponse(response);
    } catch (error) {
        console.error("Error updating vaccination campaign status:", error);
        throw error;
    }
};
