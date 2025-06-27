import { useState } from "react"
import { deleteCampaignById } from "../../../../api/manager/manager-requests-action/vaccination/delete-campaign-request-action"

export function useDeleteCampaign() {
    const [isDeleting, setIsDeleting] = useState(false)
    const [error, setError] = useState(null)

    const deleteCampaign = async (campaignId) => {
        setIsDeleting(true)
        setError(null)
        try {
            await deleteCampaignById(campaignId)
            setIsDeleting(false)
            return true
        } catch (err) {
            setError(err)
            setIsDeleting(false)
            return false
        }
    }

    return { deleteCampaign, isDeleting, error }
}
