import { useState, useEffect } from "react";
import { getAllMedicalEventByPupilId } from "@api/schoolnurse/schoolnurse-requests-action/new-event/get-medical-event-by-pupilsId-action";

export const useGetAllMedicalEventByPupilsId = (pupilId) => {
    const [medicalEventList, setMedicalEventList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {

        const fetchMedicalEventList = async () => {
            try {
                setLoading(true);
                const response = await getAllMedicalEventByPupilId(pupilId);
                setMedicalEventList(response || []);
                setError(null);
            } catch (err) {
                setError(err?.message || "Unknown error");
            } finally {
                setLoading(false);
            }
        };

        if (pupilId) {
            fetchMedicalEventList();
        }


    }, [pupilId]);

    return { medicalEventList, loading, error };
};
