import { useState, useEffect } from "react";
import { publishNewVaccinationCampaign } from "../../../../api/manager/manager-requests-action/vaccination/publish-new-vaccination-campaign-action";

export const usePublishVaccinationCampaign = () => {
    const [isPublishing, setIsPublishing] = useState(false);
    const [error, setError] = useState(null);

    const publishCampaign = async (campaignId) => {
        setIsPublishing(true);
        setError(null);
        try {
            await publishNewVaccinationCampaign(campaignId);
            setIsPublishing(false);
            return true;
        } catch (err) {
            setError(err);
            setIsPublishing(false);
            return false;
        }
    };

    return { publishCampaign, isPublishing, error };
}