import { useState, useEffect } from 'react';
import { fetchAllCampaigns } from '../../../../api/manager/manager-requests-action/healthcheck/get-all-campaign-request-action';


export const useNewestCampaign = () => {
    const [newestCampaign, setNewestCampaign] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const loadNewestCampaign = async () => {
            setIsLoading(true);
            try {
                const response = await fetchAllCampaigns();
                console.log("Fetched newest campaign:", response);
                // Return all campaigns, not just the most recent one
                if (response && response.length > 0) {
                    setNewestCampaign(response);
                } else {
                    setNewestCampaign([]);
                }
            } catch (error) {
                console.error("Failed to fetch newest campaign:", error);
                setNewestCampaign([]);
            } finally {
                setIsLoading(false);
            }
        };

        loadNewestCampaign();
    }, []);

    return { newestCampaign, isLoading };
};

