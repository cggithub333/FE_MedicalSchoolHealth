import { useState, useEffect } from "react";
import { fetchAllVaccinationCampaigns } from "../../../api/manager/manager-requests-action/vaccination/get-all-vaccination-campaign-request-action";

export const useAllCampaignByStatus = () => {
    const [allCampaigns, setAllCampaigns] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadCampaigns = async () => {
            try {
                const response = await fetchAllVaccinationCampaigns();
                setAllCampaigns(response || []);
            } catch (err) {
                console.error("Failed to fetch campaigns:", err);
                setError(err);
            } finally {
                setIsLoading(false);
            }
        };
        loadCampaigns();
    }, []);

    return { allCampaigns, isLoading, error };
}
