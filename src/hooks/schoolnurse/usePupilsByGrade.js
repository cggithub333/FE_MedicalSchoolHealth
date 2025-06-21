
import { useState, useEffect } from 'react';
import { fetchPupilsByGrade } from '../../api/schoolnurse/schoolnurse-requests-action/pupils-request-action'; // Adjust the import path as necessar

const usePupilsByGrade = (currgrade) => {

    const [pupils, setPupils] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const loadPupils = async () => {
            if (!currgrade) {
                console.warn("No grade provided, skipping pupils fetch.");
                return;
            }
            setIsLoading(true);
            try {
                const response = await fetchPupilsByGrade(currgrade);
                if (response) {
                    const pupilsGradeData = response;
                    console.log("Pupils fetched successfully:", pupilsGradeData);
                    setPupils(pupilsGradeData);
                }
            } catch (error) {
                console.error("Failed to fetch pupils:", error);
                setPupils([]); // Clear pupils on error
            } finally {
                setIsLoading(false);
            }
        };

        loadPupils();
    }, []);

    return { pupils, isLoading };
}

export default usePupilsByGrade;