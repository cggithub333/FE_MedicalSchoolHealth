import { useState, useEffect } from "react";
import { getAllHealthCheckByPupilIdAction } from "@api/schoolnurse/schoolnurse-requests-action/new-event/get-all-health-check-by-pupilId-action";

export const useGetAllHealthCheckByPupilID = (pupilId) => {
    const [healthCheckList, setHealthCheckList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchHealthCheckList = async () => {
        try {
            setLoading(true);
            const response = await getAllHealthCheckByPupilIdAction(pupilId);
            setHealthCheckList(response);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (pupilId) {
            fetchHealthCheckList();
        }
    }, [pupilId]);

    return { healthCheckList, loading, error };
}