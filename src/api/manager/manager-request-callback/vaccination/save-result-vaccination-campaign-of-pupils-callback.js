import request from "../../../request";

// Save result campaign of pupils
export const saveResultCampaignOfPupils = async ({ consentFormId, status }) => {
    try {
        const response = await request.post(`consent-forms/${consentFormId}/status`, null, {
            params: { status }
        });
        return response.data; // Return the data from the response
    } catch (error) {
        console.error("Error in saveResultCampaignOfPupils:", error);
        throw error; // Rethrow the error for handling in the calling function
    }
}