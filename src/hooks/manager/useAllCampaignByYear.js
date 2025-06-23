import { fetchCampaignByYear } from "../../api/manager/manager-requests-action/get-campaign-by-year-request-action";
import { useState, useEffect } from "react";

export const useAllCampaignByYear = (year) => {
    const [campaignsByYear, setCampaignsByYear] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCampaigns = async () => {
            try {
                const campaigns = await fetchCampaignByYear(year);
                setCampaignsByYear(campaigns);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCampaigns();
    }, [year]);

    return { campaignsByYear, isLoading, error };
}
