import { useState, useEffect } from 'react';
import { fetchPendingCampaign } from '../../api/manager/manager-requests-action/pending-campaign-request-action';

const usePendingCampaign = () => {
    const [pendingCampaign, setPendingCampaign] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const loadPendingCampaign = async () => {
            setIsLoading(true);
            try {
                const response = await fetchPendingCampaign();
                setPendingCampaign(response || []);
            } catch (error) {
                console.error("Failed to fetch pending campaign:", error);
                setPendingCampaign([]);
            } finally {
                setIsLoading(false);
            }
        };
        loadPendingCampaign();
    }, []);

    return { pendingCampaign, isLoading };
};

export default usePendingCampaign;
