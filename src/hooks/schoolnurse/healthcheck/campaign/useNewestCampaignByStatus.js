import { useState } from "react";
import { fetchNewestCampaign } from "../../../../api/schoolnurse/schoolnurse-requests-action/healthcheck/newest-campaign-request-action";


// This hook fetches the newest campaign by status (Need filter to get the campaign have the status is InProgress).
export const useNewestCampaignByStatus = () => {
    const [newestCampaign, setNewestCampaign] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchNewestCampaignByStatus = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const campaign = await fetchNewestCampaign();
            setNewestCampaign(campaign);
        } catch (err) {
            console.error("Error fetching newest campaign:", err);
            setError(err);
        } finally {
            setLoading(false);
        }
        fetchNewestCampaignByStatus();
    };

    return { newestCampaign, isLoading, error };
}