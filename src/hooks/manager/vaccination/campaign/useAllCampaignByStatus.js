import { useState, useEffect } from "react";
import { fetchAllVaccinationCampaigns } from "@api/manager/manager-requests-action/vaccination/get-all-vaccination-campaign-request-action";

export const useAllVaccinationCampaign = () => {
    const [allCampaigns, setAllCampaigns] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetchCampaigns = async () => {
        try {
            setIsLoading(true)
            const campaigns = await fetchAllVaccinationCampaigns()
            setAllCampaigns(campaigns)
            setError(null)
        } catch (err) {
            setError(err.message)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchCampaigns()
    }, [])

    const refetch = () => {
        fetchCampaigns()
    }

    return { allCampaigns, isLoading, error, refetch }
}
