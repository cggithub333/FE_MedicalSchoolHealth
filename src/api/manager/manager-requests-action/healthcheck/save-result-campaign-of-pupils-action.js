import { fetchResponse } from "../../../fetch-response";
import { saveResultCampaignOfPupils } from "../../manager-request-callback/healthcheck/save-result-campaign-of-pupils-callback.js";

export const saveResultCampaignOfPupilsAction = async (consentId, pupils) => {
    try {
        const response = await saveResultCampaignOfPupils(consentId, pupils);
        return fetchResponse(response);
    } catch (error) {
        console.error("Error in saveResultCampaignOfPupilsAction:", error);
        throw error;
    }
}