import request from "../../../request.js";

// Update campaign status
export const updateCampaignStatus = async (campaignId, status) => {
    try {
        const response = await request.patch(`management/health-check-campaigns/status/${campaignId}`, {
            statusHealthCampaign: status,
        })
        return response // Make sure to return the response
    } catch (error) {
        console.error("Error in updateCampaignStatus:", error)
        throw error
    }
}

