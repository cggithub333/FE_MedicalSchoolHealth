import { fetchResponse } from "../../../fetch-response";
import { deleteNewestCampaignAction } from "../../../../api/manager/manager-requests-action/healthcheck/delete-newest-healthcheck-campaign-action";

export const fetchAllCampaigns = async () => {
    try {
        const response = await fetchResponse(() => getAllCampaigns());

        console.log("Response from getAllCampaigns:", response);

        if (response.status === false)
            throw new Error("Can't fetch all campaigns");

        const allCampaigns = response.data;
        return allCampaigns;

    } catch (error) {
        console.error("Error : " + error);
        throw error; // Re-throw the error to handle it in the component
    }
};
