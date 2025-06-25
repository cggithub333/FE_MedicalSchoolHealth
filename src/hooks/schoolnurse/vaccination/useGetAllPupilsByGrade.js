import { fetchPupilsByGradeAndStatus } from "../../../api/schoolnurse/schoolnurse-requests-action/vaccination/get-all-pupils-approved-by-grade-request-action";
import { useState, useEffect } from "react";

const useGetAllPupilsApprovedByGrade = (grade, status) => {
    const [pupils, setPupils] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchPupils = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetchPupilsByGradeAndStatus(grade, status);
                setPupils(response || []);
            } catch (err) {
                console.error("Failed to fetch pupils:", err);
                setError(err.message || "Failed to fetch pupils");
            } finally {
                setIsLoading(false);
            }
        };

        fetchPupils();
    }, [grade, status]);

    return { pupils, isLoading, error };
};

export default useGetAllPupilsApprovedByGrade;
