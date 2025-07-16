import { useState, useEffect } from "react";
import { getMedicalEventDetailByMedicalIdAction } from "@api/schoolnurse/schoolnurse-requests-action/new-event/get-medical-event-detail-by-medicalId-action";

export const useGetMedicalEventByMedicalEventId = (medicalEventId) => {
    const [medicalEventDetail, setMedicalEventDetail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchMedicalEventDetail = async () => {
        try {
            setLoading(true);
            const response = await getMedicalEventDetailByMedicalIdAction(medicalEventId);
            setMedicalEventDetail(response.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (medicalEventId) {
            fetchMedicalEventDetail();
        }
    }, [medicalEventId]);

    return { medicalEventDetail, loading, error };
}
