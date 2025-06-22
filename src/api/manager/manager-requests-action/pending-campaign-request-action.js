import { fetchResponse } from "../../fetch-response";
import { getCampaignsByStatus } from "../../manager/manager-request-callback/pending-campaign-request-callback";

export const fetchPendingCampaign = async () => {
    try {
        // Pass ['Pending'] as intended:
        const response = await fetchResponse(() =>
            getCampaignsByStatus(['Pending'])
        );

        if (response.status === false)
            throw new Error("Can't fetch campaign");

        return response.data;

    } catch (error) {
        console.error("Error : " + error);
        throw error;
    }
};
