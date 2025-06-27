import request from "../../../request"

export async function deleteCampaignById(campaignId) {
    // Replace with your actual API endpoint
    return request(`/api/manager/vaccination/campaign/${campaignId}`, {
        method: "DELETE",
    })
}
