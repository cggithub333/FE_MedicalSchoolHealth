import { useState, useEffect } from 'react';
import { deleteVaccinationCampaignByCampaignID } from '@api/manager/manager-requests-action/vaccination/delete-vaccination-campaign-by-campaignId-action';

export const useDeleteCampaignByCampaignID = (campaignID) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const deleteCampaign = async () => {
            setIsLoading(true);
            setError(null);
            setSuccess(false);
            try {
                const response = await deleteVaccinationCampaignByCampaignID(campaignID);
                if (response.status) {
                    setSuccess(true);
                } else {
                    throw new Error("Failed to delete campaign");
                }
            } catch (err) {
                setError(err.message || "An error occurred while deleting the campaign");
            } finally {
                setIsLoading(false);
            }
        };

        if (campaignID) {
            deleteCampaign();
        }
    }, [campaignID]);

    return { isLoading, error, success };
};
