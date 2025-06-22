import { useState, useEffect } from 'react';
import { fetchNewestCampaign } from '../../api/schoolnurse/schoolnurse-requests-action/newest-campaign-request-action';

const useNewestCampaign = () => {
    const [newestCampaign, setNewestCampaign] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const loadNewestCampaign = async () => {
            setIsLoading(true);
            try {
                const response = await fetchNewestCampaign();
                setNewestCampaign(response || []);
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

export default useNewestCampaign;
