import { useState, useEffect, useCallback } from "react";
import { getNotiForPupilsNewEventAction } from "../../../api/parent/parent-requests-action/new-event/get-noti-for-pupils-new-event-action";

export const useGetNotiNewEventOfPupils = () => {
    const [notiNewEventOfPupils, setNotiNewEventOfPupils] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchNotiNewEventOfPupils = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getNotiForPupilsNewEventAction();
            //debug:
            console.log("Fetched Notifications for Pupils' New Events:", response);
            setNotiNewEventOfPupils(response.data);
        } catch (err) {
            setError(err.message);
            console.error("Error fetching notifications for pupils' new events:", err);
        } finally {
            setLoading(false);
        }
    }, []);
    useEffect(() => {
        fetchNotiNewEventOfPupils();
    }, [fetchNotiNewEventOfPupils]);

    return { notiNewEventOfPupils, loading, error, refetch: fetchNotiNewEventOfPupils };
}