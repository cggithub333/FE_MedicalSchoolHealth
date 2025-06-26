import { fetchResponse } from "../../../fetch-response.js";
import { getCampaignsByStatus } from "../../schoolnurse-requests-callback/healthcheck/newest-campaign-request-callback.js";

export const fetchNewestCampaign = async () => {
    try {
        // You want Published or InProgress only:
        const response = await fetchResponse(() =>
            getCampaignsByStatus()
        );

        if (response.status === false)
            throw new Error("Can't fetch campaign");

        return response.data;

    } catch (error) {
        console.error("Error : " + error);
        throw error;
    }
};

