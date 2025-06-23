import { useState, useEffect } from "react";
import { fetchSensitiveDisease } from "../../api/manager/manager-requests-action/get-sensitive-disease-request-action";

const useAllDisease = () => {
    const [sensitiveDiseases, setSensitiveDiseases] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const loadSensitiveDiseases = async () => {
            setIsLoading(true);
            try {
                const response = await fetchSensitiveDisease();
                setSensitiveDiseases(response || []);
            } catch (error) {
                console.error("Failed to fetch sensitive diseases:", error);
                setSensitiveDiseases([]);
            } finally {
                setIsLoading(false);
            }
        };
        loadSensitiveDiseases();
    }, []);

    return { sensitiveDiseases, isLoading };
}

export default useAllDisease;