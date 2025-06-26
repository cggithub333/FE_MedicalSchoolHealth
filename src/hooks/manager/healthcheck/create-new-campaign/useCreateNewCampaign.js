import { createNewCampaignAction } from "../../../../api/manager/manager-requests-action/newest-campaign-request-action";

const useCreateNewCampaign = () => {
    const createNewCampaign = async (campaignData) => {
        try {
            const response = await createNewCampaignAction(campaignData);
            return response;
        } catch (error) {
            console.error("Failed to create new campaign:", error);
            throw error;
        }
    };

    return { createNewCampaign };
}
export default useCreateNewCampaign;