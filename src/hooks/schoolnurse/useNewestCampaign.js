
import { useState, useEffect } from 'react';
import { fetchNewestCampaign } from '../../api/schoolnurse/schoolnurse-requests-action/newest-campaign-request-action'; // Adjust the import path as necessar

const useNewestCampaign = () => {

    const [newestCampaign, setNewestCampaign] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const loadNewestCampaign = async () => {
            setIsLoading(true);
            try {
                const response = await fetchNewestCampaign();
                if (response) {
                    console.log("Newest campaign fetched successfully:", response);
                    setNewestCampaign(response);
                }
            } catch (error) {
                console.error("Failed to fetch newest campaign:", error);
                setNewestCampaign(null); // Clear campaign on error
            } finally {
                setIsLoading(false);
            }
        };

        loadNewestCampaign();
    }, []);

    return { newestCampaign, isLoading };
}

export default useNewestCampaign;