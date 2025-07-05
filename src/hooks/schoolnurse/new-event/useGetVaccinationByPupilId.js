import { useState, useEffect } from "react";
import { getVaccinationHistoryByPupilsIdAction } from "@api/schoolnurse/schoolnurse-requests-action/new-event/use-get-vaccination-by-pupilId-action";

export const getVaccinationHistoryByPupilId = (pupilId) => {
    const [vaccinationHistory, setVaccinationHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchVaccinationHistory = async () => {
        try {
            setLoading(true);
            const response = await getVaccinationHistoryByPupilsIdAction(pupilId);
            setVaccinationHistory(response.data || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (pupilId) {
            fetchVaccinationHistory();
        }
    }, [pupilId]);

    return { vaccinationHistory, loading, error };
}