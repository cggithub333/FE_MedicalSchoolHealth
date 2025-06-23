import { useState, useEffect } from "react";
import { fetchDiseaseHealthCheck } from "../../api/schoolnurse/schoolnurse-requests-action/disease-health-check-request-action"; // Adjust the import path as necessary

const useDiseaseHealthCheck = () => {
    const [diseaseHealthCheck, setDiseaseHealthCheck] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const loadDiseaseHealthCheck = async () => {
            setIsLoading(true);
            try {
                const response = await fetchDiseaseHealthCheck();
                if (response) {
                    console.log("Disease health check fetched successfully:", response);
                    setDiseaseHealthCheck(response);
                }
            } catch (error) {
                console.error("Failed to fetch disease health check:", error);
                setDiseaseHealthCheck(null); // Clear data on error
            } finally {
                setIsLoading(false);
            }
        };

        loadDiseaseHealthCheck();
    }, []);

    return { diseaseHealthCheck, isLoading };
}

export default useDiseaseHealthCheck;