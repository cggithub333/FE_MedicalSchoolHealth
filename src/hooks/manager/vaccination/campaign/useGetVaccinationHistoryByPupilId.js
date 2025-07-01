import { useState, useEffect } from "react";
import { getVaccinationHistoryByPupilsIdAction } from "../../../../api/manager/manager-requests-action/vaccination/get-vaccination-history-by-pupilsId-action";

export const useGetVaccinationHistoryByPupilId = (pupilId) => {
    const [vaccinationHistory, setVaccinationHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchVaccinationHistory = async () => {
            // Don't fetch if pupilId is not provided
            if (!pupilId) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null); // Clear previous errors

                const response = await getVaccinationHistoryByPupilsIdAction(pupilId);

                // Handle the response data
                if (response && response.data) {
                    setVaccinationHistory(Array.isArray(response.data) ? response.data : []);
                } else {
                    setVaccinationHistory([]);
                }
            } catch (err) {
                console.error("Error in useGetVaccinationHistoryByPupilId:", err);
                setError(err);
                setVaccinationHistory([]); // Reset to empty array on error
            } finally {
                setLoading(false);
            }
        };

        fetchVaccinationHistory();
    }, [pupilId]);

    return { vaccinationHistory, loading, error };
};