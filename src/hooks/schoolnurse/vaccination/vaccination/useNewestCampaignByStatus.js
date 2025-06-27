import { useEffect, useState } from 'react';
import { fetchNewestVaccinationCampaign } from '../../../../api/schoolnurse/schoolnurse-requests-action/vaccination/newest-vaccination-campaign-request-action';


// This hook fetches the newest vaccination campaign(status is Pupished and In Progress).
export const useNewestVaccinationCampaign = () => {
    const [newestVaccinationCampaign, setNewestVaccinationCampaign] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadNewestCampaign = async () => {
            setIsLoading(true);
            try {
                const response = await fetchNewestVaccinationCampaign();
                console.log("Fetched newest vaccination campaign:", response);
                setNewestVaccinationCampaign(response || []);
            } catch (error) {
                console.error("Failed to fetch newest vaccination campaign:", error);
                setNewestVaccinationCampaign([]);
                setError(error);
            } finally {
                setIsLoading(false);
            }
        };

        loadNewestCampaign();
    }, []);

    return { newestVaccinationCampaign, isLoading, error };
};

