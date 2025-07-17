import { useState, useEffect } from 'react';
import { getAllPrescriptionAction } from '@api/schoolnurse/schoolnurse-requests-action/main-contents/get-all-prescription-action.js';

export const useGetAllPrescription = () => {
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPrescriptions = async () => {
            try {
                setLoading(true);
                const data = await getAllPrescriptionAction();
                setPrescriptions(data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchPrescriptions();
    }, []);

    return { prescriptions, loading, error };
}