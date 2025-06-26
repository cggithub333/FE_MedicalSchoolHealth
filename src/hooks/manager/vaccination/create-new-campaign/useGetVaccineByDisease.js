import { useState, useEffect } from "react";
import { fetchAllVaccinationDiseases } from "../../../../api/manager/manager-requests-action/vaccination/get-all-vaccination-disease-request.action";

const useGetVaccineByDisease = () => {
    const [vaccinesByDisease, setVaccinesByDisease] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const loadVaccines = async () => {
            setIsLoading(true);
            try {
                const response = await fetchAllVaccinationDiseases();
                console.log("✅ API raw response:", response);
                // ✅ response is ALREADY an array
                setVaccinesByDisease(response || []);
            } catch (error) {
                console.error("Failed to fetch:", error);
                setVaccinesByDisease([]);
            } finally {
                setIsLoading(false);
            }
        };

        loadVaccines();
    }, []);

    return { vaccines: vaccinesByDisease, isLoading };
};

export default useGetVaccineByDisease;
