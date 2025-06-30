import { useState, useEffect, useCallback } from 'react';
import { fetchAllCampaigns } from '../../../../api/manager/manager-requests-action/healthcheck/get-all-campaign-request-action';

export const useNewestCampaign = () => {
    const [newestCampaign, setNewestCampaign] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const loadNewestCampaign = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await fetchAllCampaigns();
            setNewestCampaign(response && response.length > 0 ? response : []);
        } catch (error) {
            setNewestCampaign([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadNewestCampaign();
    }, [loadNewestCampaign]);

    return { newestCampaign, isLoading, refetch: loadNewestCampaign };
};