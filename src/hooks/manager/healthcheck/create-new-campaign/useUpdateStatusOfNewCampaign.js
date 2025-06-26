import { useState, useEffect } from 'react';
import { updateCampaignStatus } from '../../../../api/manager/manager-requests-action/healthcheck/get-all-campaign-request-action';

//update status of newest campaign
export const updateStatusOfNewestCampaignAction = async (campaignId, status) => {
    try {
        const response = await updateCampaignStatus(campaignId, status);

        if (response.status === false)
            throw new Error("Can't update campaign status");

        return response.data;

    } catch (error) {
        console.error("Error : " + error);
        throw error;
    }
};

