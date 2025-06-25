import { useState, useEffect } from "react";
import { fetchHealthCheckDisease } from "../../api/schoolnurse/schoolnurse-requests-action/health-check-disease-action"; // Adjust the import path as necessary

const useDiseaseByPupilId = (pupilId) => {
    const [diseaseData, setDiseaseData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!pupilId) return;

        const fetchData = async () => {
            setIsLoading(true);
            try {
                const response = await fetchHealthCheckDisease(pupilId); // response = data
                setDiseaseData(response); // ✅ FIXED HERE
            } catch (error) {
                console.error(error);
                setDiseaseData(null);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [pupilId]);

    return { diseaseData, isLoading };
};


export default useDiseaseByPupilId;