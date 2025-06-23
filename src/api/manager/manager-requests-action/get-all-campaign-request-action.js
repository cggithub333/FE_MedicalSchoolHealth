import { fetchResponse } from "../../fetch-response";
import { getAllCampaigns } from "../manager-request-callback/get-all-campaign-request-callback";

export const fetchAllCampaigns = async () => {
    try {
        const response = await fetchResponse(() => getAllCampaigns());

        if (response.status === false)
            throw new Error("Can't fetch all campaigns");

        const allCampaigns = response.data;
        return allCampaigns;

    } catch (error) {
        console.error("Error : " + error);
        throw error; // Re-throw the error to handle it in the component
    }
};
