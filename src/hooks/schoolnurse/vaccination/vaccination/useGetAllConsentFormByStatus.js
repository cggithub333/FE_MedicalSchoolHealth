import { useState, useEffect } from "react";
import { fetchConsentFormVaccinationByStatus } from "../../../../api/schoolnurse/schoolnurse-requests-action/vaccination/get-consent-form-vaccination-by-status-action";

// This hook fetches all consent forms for a vaccination campaign by status.
export const useGetAllConsentFormByStatus = (campaignId, status) => {
    const [consentForms, setConsentForms] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadConsentForms = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetchConsentFormVaccinationByStatus(campaignId, status);
                // Support both array and object-with-array API responses
                if (Array.isArray(response)) {
                    setConsentForms(response);
                } else if (response && Array.isArray(response.getConsentFormVaccinationByStatus)) {
                    setConsentForms(response.getConsentFormVaccinationByStatus);
                } else {
                    setConsentForms([]);
                }
            } catch (err) {
                console.error("Failed to fetch consent forms:", err);
                setError(err);
                setConsentForms([]);
            } finally {
                setIsLoading(false);
            }
        };

        loadConsentForms();
    }, [campaignId, status]);

    return { consentForms, isLoading, error };
}   