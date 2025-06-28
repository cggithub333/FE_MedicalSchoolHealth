import { useState } from "react";
import { createNewCampaignAction } from "../../../../api/manager/manager-requests-action/healthcheck/create-new-healthcheck-campaign-action";

const useCreateNewCampaign = () => {
    const [isCreating, setIsCreating] = useState(false)
    const [error, setError] = useState(null)

    const createNewCampaign = async (campaignData) => {
        setIsCreating(true)
        setError(null)
        try {
            const response = await createNewCampaignAction(campaignData)
            return response
        } catch (error) {
            console.error("Failed to create new campaign:", error)
            setError(error.message || "Failed to create campaign")
            throw error
        } finally {
            setIsCreating(false)
        }
    }

    return { createNewCampaign, isCreating, error }
}

export default useCreateNewCampaign
