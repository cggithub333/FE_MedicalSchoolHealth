import { useState, useEffect } from "react";
import { getAllMedicationMedicalAction } from "../../../api/schoolnurse/schoolnurse-requests-action/new-event/get-medical-event-list-action";

export const useGetAllMedicalEvent = () => {
    const [medicalEventList, setMedicalEventList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchMedicalEventList = async () => {
        try {
            setLoading(true);
            const response = await getAllMedicationMedicalAction();
            setMedicalEventList(response.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMedicalEventList();
    }, []);

    return { medicalEventList, loading, error };
}
