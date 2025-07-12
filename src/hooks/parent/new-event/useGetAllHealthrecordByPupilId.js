import { useState, useEffect } from "react";
import { getAllHealthRecordByPupilsAction } from "../../../api/parent/parent-requests-action/new-event/get-all-health-record-by-pupils-action";

export const useGetAllHealthRecordByPupilId = (pupilId) => {
    const [healthRecords, setHealthRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchHealthRecords = async () => {
            try {
                setLoading(true);
                const response = await getAllHealthRecordByPupilsAction(pupilId);
                setHealthRecords(response.data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        if (pupilId) {
            fetchHealthRecords();
        }
    }, [pupilId]);

    return { healthRecords, loading, error };
}