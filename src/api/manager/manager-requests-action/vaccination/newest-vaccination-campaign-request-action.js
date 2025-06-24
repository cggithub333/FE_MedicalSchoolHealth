import { fetchResponse } from "../../../fetch-response";
import { getNewestCampaignsByStatus } from "../../manager-request-callback/vaccination/newest-vaccination-campaign-request-callback";

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