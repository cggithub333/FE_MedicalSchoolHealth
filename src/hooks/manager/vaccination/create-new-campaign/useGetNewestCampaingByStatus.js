import { useState, useEffect } from "react";
import { fetchAllVaccinationCampaigns } from "../../../../api/manager/manager-requests-action/vaccination/get-all-vaccination-campaign-request-action";

export const useNewestCampaignByStatus = () => {
    const [allCampaigns, setAllCampaigns] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadCampaigns = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetchAllVaccinationCampaigns();
            setAllCampaigns(response || []);
        } catch (err) {
            console.error("Failed to fetch campaigns:", err);
            setError(err);
            setAllCampaigns([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadCampaigns();
    }, []);

    return { allCampaigns, isLoading, error, refetch: loadCampaigns };
}

