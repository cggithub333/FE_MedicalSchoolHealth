import { useState, useEffect } from 'react';
import { fetchNewestVaccinationCampaign } from '../../../../api/manager/manager-requests-action/vaccination/newest-vaccination-campaign-request-action';

const useNewestVaccinationCampaign = () => {
    const [newestVaccinationCampaign, setNewestVaccinationCampaign] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
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
    }, []);

    return { newestVaccinationCampaign, isLoading };
};

export default useNewestVaccinationCampaign;
