import { useState, useEffect } from "react";
import { fetchAllCampaigns } from "../../../../api/manager/manager-requests-action/healthcheck/get-all-campaign-request-action";

export const useAllCampaign = () => {
    const [allCampaigns, setAllCampaigns] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchCampaigns = async () => {
        try {
            setIsLoading(true)
            const campaigns = await fetchAllCampaigns();
            setAllCampaigns(campaigns);
            setError(null)
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        fetchCampaigns()
    }, [])
    const refetch = () => {
        fetchCampaigns()
    }

    return { allCampaigns, isLoading, error, refetch };
}