import { useState } from 'react';
import { fetchNewestVaccinationCampaign } from '../../../../api/schoolnurse/schoolnurse-requests-action/vaccination/newest-vaccination-campaign-request-action';


// This hook fetches the newest vaccination campaign(status is Pupished and In Progress).
export const useNewestVaccinationCampaign = () => {
    const [newestVaccinationCampaign, setNewestVaccinationCampaign] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const loadNewestVaccinationCampaign = async () => {
        setIsLoading(true);
        try {
            const response = await fetchNewestVaccinationCampaign();
            setNewestVaccinationCampaign(response || []);
        } catch (error) {
            console.error("Failed to fetch newest campaign:", error);
            setNewestVaccinationCampaign([]);
        } finally {
            setIsLoading(false);
        }
    };
    loadNewestVaccinationCampaign();

    return { newestVaccinationCampaign, isLoading };
};

