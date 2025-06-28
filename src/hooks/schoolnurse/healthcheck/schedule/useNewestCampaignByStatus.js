import { useEffect, useState } from "react";
import { fetchNewestCampaign } from "../../../../api/schoolnurse/schoolnurse-requests-action/healthcheck/newest-campaign-request-action";


// This hook fetches the newest campaign by status (Need filter to get the campaign have the status is InProgress).
export const useNewestCampaignByStatus = () => {
    const [newestCampaign, setNewestCampaign] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadNewestCampaign = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetchNewestCampaign();
                setNewestCampaign(response || null);
            } catch (err) {
                console.error("Failed to fetch newest campaign:", err);
                setError(err);
                setNewestCampaign(null);
            } finally {
                setLoading(false);
            }
        };

        loadNewestCampaign();
    }, []);

    return { newestCampaign, loading, error };
}