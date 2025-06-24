import request from "../../request";
// ✅ Use a parameter, no quotes in URL:
export const getNewestCampaignsByStatus = async () => request.get("getnewestcampaign");

export const updateStatusOfNewestCampaign = async (campaignId, status) => {
    return request.patch(`getnewestcampaign/${campaignId}`,
        { status: status },
        {
            headers: {
                'Content-Type': 'application/json'
            }
        }
    );
}