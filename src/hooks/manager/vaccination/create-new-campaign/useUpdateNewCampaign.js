import { useState } from "react";
import { updateVaccinationCampaignStatusAction } from "../../../../api/manager/manager-requests-action/vaccination/update-new-vaccination-campaign-action";

export const useUpdateNewCampaign = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)

    const updateNewCampaign = async (campaignId, status) => {
        setIsLoading(true)
        setError(null)
        try {
            const response = await updateVaccinationCampaignStatusAction({ campaignId, status })
            return response
        } catch (err) {
            console.error("Error updating vaccination campaign:", err)
            setError(err)
            throw err
        } finally {
            setIsLoading(false)
        }
    }

    return { updateNewCampaign, isLoading, error }
}