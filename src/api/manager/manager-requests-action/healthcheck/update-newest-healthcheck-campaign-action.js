import { fetchResponse } from "../../../fetch-response";
import { updateCampaignStatus } from "../../manager-request-callback/healthcheck/update-newest-healthcheck-campaign-callback";

import { fetchResponse } from "../../../fetch-response"
import { updateCampaignStatus } from "../../manager-request-callback/healthcheck/update-newest-healthcheck-campaign-callback"

export const updateNewestCampaignStatusAction = async (campaignId, status) => {
    try {
        const response = await fetchResponse(() => updateCampaignStatus(campaignId, status))

        console.log("Response from updateNewestCampaignStatusAction:", response)

        if (response.status === false) {
            throw new Error("Can't update campaign status")
        }

        return response // Return the full response, not just response.data
    } catch (error) {
        console.error("Error updating campaign status:", error)
        throw error
    }
}

