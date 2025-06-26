import { useState, useEffect } from 'react';
import { fetchAllCampaigns, updateCampaignStatus } from '../../../../api/manager/manager-requests-action/healthcheck/get-all-campaign-request-action';


export const useNewestCampaign = () => {
    const [newestCampaign, setNewestCampaign] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const loadNewestCampaign = async () => {
        setIsLoading(true);
        try {
            const response = await fetchAllCampaigns();
            setNewestCampaign(response || []);
        } catch (error) {
            console.error("Failed to fetch newest campaign:", error);
            setNewestCampaign([]);
        } finally {
            setIsLoading(false);
        }
    };
    loadNewestCampaign();

    return { newestCampaign, isLoading };
};

