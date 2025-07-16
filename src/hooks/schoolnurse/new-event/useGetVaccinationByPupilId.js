import { useState, useEffect } from "react";
import { getVaccinationHistoryByPupilsIdAction } from "@api/schoolnurse/schoolnurse-requests-action/new-event/use-get-vaccination-by-pupilId-action";

export const useGetVaccinationHistoryByPupilId = (pupilId) => {
    const [vaccinationHistory, setVaccinationHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchVaccinationHistory = async () => {
            try {
                setLoading(true);
                const response = await getVaccinationHistoryByPupilsIdAction(pupilId);
                console.log("Vaccination History Response:", response);
                // Always extract the array from response.data if it exists
                if (Array.isArray(response?.data)) {
                    setVaccinationHistory(response.data);
                } else if (Array.isArray(response)) {
                    setVaccinationHistory(response);
                } else {
                    setVaccinationHistory([]);
                }
                setError(null);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        if (pupilId) {
            fetchVaccinationHistory();
        }
    }, [pupilId]);

    return { vaccinationHistory, loading, error };
}