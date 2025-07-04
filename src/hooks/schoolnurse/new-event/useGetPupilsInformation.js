import { useState, useEffect } from "react";
import getAllPupilsListAction from "../../../api/schoolnurse/schoolnurse-requests-action/new-event/get-all-pupils-list-action";

export const useGetPupilsInformation = () => {
    const [pupilsList, setPupilsList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchPupilsList = async () => {
        try {
            setLoading(true);
            const response = await getAllPupilsListAction();
            setPupilsList(response.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPupilsList();
    }, []);

    return { pupilsList, loading, error };
}