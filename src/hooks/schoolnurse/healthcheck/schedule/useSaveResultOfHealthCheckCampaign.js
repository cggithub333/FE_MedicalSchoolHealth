import { useState, useEffect } from "react";
import { saveResultCampaignOfPupilsAction } from "../../../../api/manager/manager-requests-action/healthcheck/save-result-campaign-of-pupils-action";

export function useSaveResultOfHealthCheckCampaign() {
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);

    const saveResultOfHealthCheckCampaign = async (consentId, pupils) => {
        setIsSaving(true);
        setError(null);
        try {
            console.log("Saving health check campaign results for consent ID:", consentId, "with pupils data:", pupils);
            await saveResultCampaignOfPupilsAction(consentId, pupils);
            setIsSaving(false);
            return true;
        } catch (err) {
            setError(err);
            setIsSaving(false);
            return false;
        }
    };

    return { saveResultOfHealthCheckCampaign, isSaving, error };
}