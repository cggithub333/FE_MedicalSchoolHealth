import { useState, useEffect } from 'react';
import { fetchNewestVaccinationCampaign } from '../../../../api/schoolnurse/schoolnurse-requests-action/vaccination/newest-vaccination-campaign-request-action';


//get all campaign have the status is published and in progress
export const useNewestVaccinationCampaign = () => {
    const [newestVaccinationCampaign, setNewestVaccinationCampaign] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        const loadNewestVaccinationCampaign = async () => {
            setIsLoading(true)
            try {
                const response = await fetchNewestVaccinationCampaign()
                setNewestVaccinationCampaign(response || [])
            } catch (error) {
                console.error("Failed to fetch newest vaccination campaign:", error)
                setNewestVaccinationCampaign([])
            } finally {
                setIsLoading(false)
            }
        }

        loadNewestVaccinationCampaign()
    }, []) // Empty dependency array to run only once

    return { newestVaccinationCampaign, isLoading }
}

