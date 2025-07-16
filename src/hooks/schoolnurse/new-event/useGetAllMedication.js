import { useState, useEffect } from "react";
import { getAllMedicationMedicalAction } from "../../../api/schoolnurse/schoolnurse-requests-action/new-event/get-all-medication-medical-action";

export const useGetAllMedication = () => {
    const [medicationList, setMedicationList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchMedicationList = async () => {
        try {
            setLoading(true);
            const response = await getAllMedicationMedicalAction();
            setMedicationList(response.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMedicationList();
    }, []);

    return { medicationList, loading, error };
}