import { fetchResponse } from "../../fetch-response";
import { getNewestCampaignsByStatus } from "../../manager/manager-request-callback/newest-campaign-request-callback";
import { updateStatusOfNewestCampaign } from "../../manager/manager-request-callback/newest-campaign-request-callback";

export const fetchNewestCampaign = async () => {
    try {
        // Pass ['Pending'] as intended:
        const response = await fetchResponse(() =>
            getNewestCampaignsByStatus()
        );

        if (response.status === false)
            throw new Error("Can't fetch campaign");

        return response.data;

    } catch (error) {
        console.error("Error : " + error);
        throw error;
    }
};

export const updateStatusOfNewestCampaignAction = async (campaignId, status) => {
    try {
        const response = await fetchResponse(() =>
            updateStatusOfNewestCampaign(campaignId, status)
        );

        if (response.status === false)
            throw new Error("Can't update campaign status");

        return response.data;

    } catch (error) {
        console.error("Error : " + error);
        throw error;
    }
}