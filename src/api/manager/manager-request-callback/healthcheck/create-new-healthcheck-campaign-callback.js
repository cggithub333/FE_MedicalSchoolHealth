import request from "../../../request.js"

// Create new campaign
export const createNewCampaign = async (campaignData) => {
    try {
        const response = await request.post("management/health-check-campaigns", campaignData)
        return response
    } catch (error) {
        console.error("Error in createNewCampaign callback:", error)
        throw error
    }
}
