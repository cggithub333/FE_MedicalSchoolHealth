import { useEffect, useState } from "react";
import { fetchPupilsByGradeAndStatus } from "@api/schoolnurse/schoolnurse-requests-action/vaccination/get-all-pupils-approved-by-grade-request-action";

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
                // Support both array and object-with-array API responses
                if (Array.isArray(response)) {
                    setPupils(response);
                } else if (response && Array.isArray(response.getPupilsApprovedByGrade)) {
                    setPupils(response.getPupilsApprovedByGrade);
                } else {
                    setPupils([]);
                }
            } catch (err) {
                console.error("Failed to fetch pupils:", err);
                setError(err);
                setPupils([]);
            } finally {
                setIsLoading(false);
            }
        };

        loadPupils();
    }, [campaignId]);

    return { pupils, isLoading, error };
};

