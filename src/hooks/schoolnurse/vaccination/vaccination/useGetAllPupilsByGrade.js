import { fetchPupilsByGradeAndStatus } from "../../../../api/schoolnurse/schoolnurse-requests-action/vaccination/get-all-pupils-approved-by-grade-request-action";
import { useState } from "react";

// This hook fetches all pupils approved by their grade and status.
export const useGetAllPupilsApprovedByGrade = (campaignId) => {
    const [pupils, setPupils] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const fetchPupils = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetchPupilsByGradeAndStatus(campaignId);
            setPupils(response || []);
        } catch (err) {
            console.error("Failed to fetch pupils:", err);
            setError(err.message || "Failed to fetch pupils");
        } finally {
            setIsLoading(false);
        }
    };

    fetchPupils();

    return { pupils, isLoading, error };
};

