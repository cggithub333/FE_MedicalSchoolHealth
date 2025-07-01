import { fetchResponse } from "../../../fetch-response";
import { saveResultVaccinationCampaignOfPupils } from "../../manager-request-callback/vaccination/save-result-vaccination-campaign-of-pupils-callback.js";

export const saveResultCampaignOfPupilsAction = async ({ consentFormId, status, notes }) => {
    try {
        const response = await saveResultVaccinationCampaignOfPupils({ consentFormId, status, notes });
        return fetchResponse(response);
    } catch (error) {
        console.error("Error in saveResultCampaignOfPupilsAction:", error);
        throw error;
    }
};