import { fetchResponse } from "../../fetch-response.js";
import { getNewestCampaign } from "../schoolnurse-requests-callback/newest-campaign-request-callback.js";

export const fetchNewestCampaign = async () => {
    try {
        const response = await fetchResponse(() => getNewestCampaignRequest());

        if (response.status === false)
            throw new Error("Can't fetch campaign");

        const NewestCampaign = response.data;
        return NewestCampaign;

    } catch (error) {
        console.error("Error : " + error);
        throw error; // Re-throw the error to handle it in the component
    }
};
