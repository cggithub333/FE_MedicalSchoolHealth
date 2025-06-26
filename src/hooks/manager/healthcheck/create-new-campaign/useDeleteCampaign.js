import { useState } from "react";
import { deleteCampaign } from "../../../../api/manager/manager-requests-action/healthcheck/get-all-campaign-request-action";

export const useDeleteCampaign = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const deleteCampaignById = async (campaignId) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await deleteCampaign(campaignId);
            if (response.status === false) {
                throw new Error("Failed to delete campaign");
            }
            return response.data;
        } catch (err) {
            console.error("Error deleting campaign:", err);
            setError(err);
            throw err; // Re-throw the error for further handling
        } finally {
            setIsLoading(false);
        }
    };

    return { deleteCampaignById, isLoading, error };
}
