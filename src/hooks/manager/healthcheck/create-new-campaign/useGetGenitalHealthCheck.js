import { useState, useEffect } from "react";
import { getHealthCheckGenitalDiseaseAction } from "../../../../api/manager/manager-requests-action/healthcheck/get-health-check-genital-disease-action";

export const useGetGenitalHealthCheck = () => {
    const [genitalHealthCheck, setGenitalHealthCheck] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchGenitalHealthCheck = async () => {
            try {
                const data = await getHealthCheckGenitalDiseaseAction();
                setGenitalHealthCheck(data || []);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchGenitalHealthCheck();
    }, []);

    return { genitalHealthCheck, loading, error };
}
