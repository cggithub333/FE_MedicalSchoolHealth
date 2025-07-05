import { useState, useEffect } from "react";
import { getAllMedicalEventByPupilId } from "@api/schoolnurse/schoolnurse-requests-action/new-event/get-medical-event-by-pupilsId-action";

export const useGetAllMedicalEventByPupilsId = (pupilId) => {
    const [medicalEventList, setMedicalEventList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchMedicalEventList = async () => {
        try {
            setLoading(true);
            const response = await getAllMedicalEventByPupilId(pupilId);
            setMedicalEventList(response.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (pupilId) {
            fetchMedicalEventList();
        }
    }, [pupilId]);

    return { medicalEventList, loading, error };
}

