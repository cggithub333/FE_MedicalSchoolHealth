import { fetchResponse } from "../../../fetch-response";
import { createNewCampaign } from "../../manager-request-callback/healthcheck/create-new-healthcheck-campaign-callback";

export const createNewCampaignAction = async (campaignData) => {
    try {
        const response = await fetchResponse(() => createNewCampaign(campaignData))


        if (response.status === false) throw new Error("Can't create new campaign")

        return response.data
    } catch (error) {
        console.error("Error creating new campaign:", error)
        throw error // Re-throw the error to handle it in the component
    }
}
