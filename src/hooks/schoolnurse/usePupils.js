
import { useState, useEffect } from 'react';
import { fetchAllPupils } from '../../api/schoolnurse/schoolnurse-requests-action/pupils-request-action'; // Adjust the import path as necessar

const usePupils = () => {

    const [pupils, setPupils] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const loadPupils = async () => {
            setIsLoading(true);
            try {
                const fetchedPupils = await fetchAllPupils();
                setPupils(fetchedPupils);
            } catch (error) {
                console.error("Failed to fetch pupils:", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadPupils();
    }, []);

    return { pupils, isLoading };
}

export default usePupils;