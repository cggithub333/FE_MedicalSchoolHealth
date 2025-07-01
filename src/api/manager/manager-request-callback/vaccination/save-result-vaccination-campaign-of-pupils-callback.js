import request from "../../../request";

export const saveResultVaccinationCampaignOfPupils = async ({ consentFormId, status, notes }) => {
    try {
        const response = await request.patch(
            `consent-forms/${consentFormId}/status`,
            { status, notes } // Send as request body, not params
        );
        return response.data;
    } catch (error) {
        console.error("Error in saveResultVaccinationCampaignOfPupils:", error);
        throw error;
    }
};