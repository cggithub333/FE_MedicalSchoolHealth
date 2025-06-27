import { fetchPupilsByGradeAndStatus } from "../../../../api/schoolnurse/schoolnurse-requests-action/vaccination/get-all-pupils-approved-by-grade-request-action";
import { useEffect, useState } from "react";

// This hook fetches all pupils approved by their grade and status.
export const useGetAllPupilsApprovedByGrade = (campaignId) => {
    const [pupils, setPupils] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadPupils = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetchPupilsByGradeAndStatus(campaignId);
                setPupils(response || []);
            } catch (err) {
                console.error("Failed to fetch pupils:", err);
                setError(err);
                setPupils([]);
            } finally {
                setIsLoading(false);
            }
        };

        loadPupils();
    }, []);

    return { pupils, isLoading, error };
};

