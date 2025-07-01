import { useState } from "react";
import { saveResultCampaignOfPupilsAction } from "../../../../api/manager/manager-requests-action/vaccination/save-result-vaccination-campaign-of-pupils-action";

export function useSaveResultOfVaccinationCampaign() {
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const saveResultOfVaccinationCampaign = async (consentFormId, status, notes) => {
        // Input validation
        if (!consentFormId) {
            const validationError = new Error("Consent Form ID is required");
            setError(validationError);
            return false;
        }

        if (!status) {
            const validationError = new Error("Status is required");
            setError(validationError);
            return false;
        }

        setIsSaving(true);
        setError(null);
        setSuccess(false);

        try {
            await saveResultCampaignOfPupilsAction({
                consentFormId, // Fixed: was consentId
                status,
                notes // Fixed: was note
            });

            setSuccess(true);
            return true;
        } catch (err) {
            console.error("Error saving vaccination campaign result:", err);
            setError(err);
            return false;
        } finally {
            setIsSaving(false);
        }
    };

    const resetState = () => {
        setError(null);
        setSuccess(false);
    };

    return {
        saveResultOfVaccinationCampaign,
        isSaving,
        error,
        success,
        resetState
    };
}