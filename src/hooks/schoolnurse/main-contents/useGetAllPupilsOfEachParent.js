import { useState, useEffect } from "react";
import { getAllChildOfEachParentsAction } from "@api/schoolnurse/schoolnurse-requests-action/main-contents/get-all-child-of-each-parents-action";

export const useGetAllPupilsOfEachParent = () => {
    const [pupils, setPupils] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPupils = async () => {
            try {
                setLoading(true);
                const response = await getAllChildOfEachParentsAction();
                console.log("Pupils1 data:", response); // Debugging log
                if (response) {
                    setPupils(response);
                } else {
                    setPupils([]);
                }
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchPupils();
    }, []);

    return { pupils, loading, error };
}