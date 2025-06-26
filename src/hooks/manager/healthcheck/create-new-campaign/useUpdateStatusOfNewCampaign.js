import { useState, useEffect } from 'react';
import { updateNewestCampaignStatusAction } from '../../../../api/manager/manager-requests-action/healthcheck/update-newest-healthcheck-campaign-action';

export const useUpdateCampaignStatus = () => {
    const [isUpdating, setIsUpdating] = useState(false)

    const updateCampaignStatus = async (campaignId, status) => {
        setIsUpdating(true)
        try {
            const response = await updateNewestCampaignStatusAction(campaignId, status)
            return response
        } catch (error) {
            console.error("Error updating campaign status:", error)
            throw error
        } finally {
            setIsUpdating(false)
        }
    }

    return { updateCampaignStatus, isUpdating }
}


