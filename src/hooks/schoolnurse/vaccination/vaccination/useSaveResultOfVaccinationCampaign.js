import { useState, useEffect } from "react";
import { saveResultCampaignOfPupilsAction } from "../../../../api/manager/manager-requests-action/vaccination/save-result-vaccination-campaign-of-pupils-action";

export function useSaveResultOfVaccinationCampaign() {
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);

    const saveResultOfVaccinationCampaign = async (consentId, status) => {
        setIsSaving(true);
        setError(null);
        try {
            await saveResultCampaignOfPupilsAction({ consentId, status });
            setIsSaving(false);
            return true;
        } catch (err) {
            console.error("Error saving vaccination campaign result:", err);
            setError(err);
            setIsSaving(false);
            return false;
        }
    };

    return { saveResultOfVaccinationCampaign, isSaving, error };
}