import { fetchResponse } from "../../../fetch-response";
import { getDetailsOfHealthCheckCampaignCallback } from "../../../manager/manager-request-callback/healthcheck/get-details-of-health-check-campaign-callback";

export const getDetailsOfHealthCheckCampaignAction = async (campaignId) => {
    console.log("ACTION: Starting fetch for campaign:", campaignId);
    try {
        // Only call fetchResponse ONCE, passing a function that returns a promise
        const response = await fetchResponse(() => getDetailsOfHealthCheckCampaignCallback(campaignId));
        console.log("ACTION: Callback response:", response);
        // Return the response directly (do not call fetchResponse again)
        return response;
    } catch (error) {
        console.error("ACTION: Error occurred:", error);
        throw error;
    }
}