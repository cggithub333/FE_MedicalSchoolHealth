import { useState, useEffect } from 'react';
import { fetchPupilsByGrade } from '../../api/schoolnurse/schoolnurse-requests-action/pupils-by-grade-request-action';

const usePupilsByGrade = (currgrade) => {
    const [pupils, setPupils] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const loadPupils = async () => {
            if (!currgrade) {
                setPupils([]);
                return;
            }
            setIsLoading(true);
            try {
                const response = await fetchPupilsByGrade(currgrade);
                // If response is { pupils: [...] }, extract the array
                if (response && Array.isArray(response.pupils)) {
                    setPupils(response.pupils);
                } else if (Array.isArray(response)) {
                    setPupils(response);
                } else {
                    setPupils([]);
                }
            } catch (error) {
                console.error("Failed to fetch pupils:", error);
                setPupils([]);
            } finally {
                setIsLoading(false);
            }
        };
        loadPupils();
    }, [currgrade]);

    return { pupils, isLoading };
}

export default usePupilsByGrade;