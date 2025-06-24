import { useState, useEffect } from "react";
import { fetchVaccinationCampaignByYear } from "../../../api/manager/manager-requests-action/vaccination/get-campaign-by-year-request-action";

export const useAllCampaignByYear = (year) => {
    const [campaigns, setCampaigns] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const loadCampaigns = async () => {
            setIsLoading(true);
            try {
                const response = await fetchVaccinationCampaignByYear(year);
                setCampaigns(response || []);
            } catch (error) {
                console.error("Failed to fetch campaigns by year:", error);
                setCampaigns([]);
            } finally {
                setIsLoading(false);
            }
        };
        loadCampaigns();
    }, [year]);

    return { campaigns, isLoading };
};

