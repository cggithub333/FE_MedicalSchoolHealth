import { fetchResponse } from "../../../fetch-response";
import { getVaccinationCampaignByCampaignIdCallback } from "../../manager-request-callback/vaccination/get-vaccination-campaign-by-campaignid-callback";

export const getVaccinationCampaignByCampaignIdAction = async (campaignId) => {
    try {
        // Pass a function to fetchResponse, not a resolved promise
        return fetchResponse(() => getVaccinationCampaignByCampaignIdCallback(campaignId));
    } catch (error) {
        console.error("Error in getVaccinationCampaignByCampaignIdAction:", error);
        throw error;
    }
}