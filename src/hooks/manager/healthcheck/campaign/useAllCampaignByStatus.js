import { useState, useEffect } from "react";
import { fetchAllCampaigns } from "../../../../api/manager/manager-requests-action/healthcheck/get-all-campaign-request-action";

export const useAllCampaign = () => {
    const [allCampaigns, setAllCampaigns] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchCampaigns = async () => {
        try {
            const campaigns = await fetchAllCampaigns();
            setAllCampaigns(campaigns);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    fetchCampaigns();

    return { allCampaigns, isLoading, error };
}