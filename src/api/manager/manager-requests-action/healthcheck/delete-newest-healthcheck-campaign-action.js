import { fetchResponse } from "../../../fetch-response";
import { deleteCampaign } from "../../manager-request-callback/healthcheck/delete-newest-healthcheck-campaign-callback";

export const deleteNewestCampaignAction = async (campaignId) => {
    try {
        const response = await fetchResponse(() => deleteCampaign(campaignId));
        console.log("Response from deleteNewestCampaignAction:", response);
        if (response.status === false)
            throw new Error("Can't delete campaign");
        return response.data;

    } catch (error) {
        console.error("Error : " + error);
        throw error; // Re-throw the error to handle it in the component
    }
}