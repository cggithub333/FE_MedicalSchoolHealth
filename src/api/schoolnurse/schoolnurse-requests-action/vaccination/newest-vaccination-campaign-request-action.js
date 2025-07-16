import { fetchResponse } from "../../../fetch-response.js";
import { getNewestCampaignsByStatus } from "../../schoolnurse-requests-callback/vaccination/newest-vaccination-campaign-request-callback.js";

export const fetchNewestVaccinationCampaign = async () => {
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

