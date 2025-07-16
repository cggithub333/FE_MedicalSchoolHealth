import { createNewVaccinationCampaignAction } from "../../../../api/manager/manager-requests-action/vaccination/create-new-vaccination-campaign-action";
import { useState } from "react";

export const useCreateNewCampaign = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const createNewCampaign = async (data) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await createNewVaccinationCampaignAction(data);
            return response;
        } catch (err) {
            console.error("Error creating new vaccination campaign:", err);
            setError(err);
            throw err; // Re-throw the error to handle it in the component
        } finally {
            setIsLoading(false);
        }
    };

    return { createNewCampaign, isLoading, error };
}
