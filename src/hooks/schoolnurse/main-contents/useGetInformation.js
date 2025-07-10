import { useState, useEffect } from "react";
import { getInformationOfUserAction } from "@api/schoolnurse/schoolnurse-requests-action/main-contents/get-information-of-user-action.js";

export const useGetInformation = () => {
    const [information, setInformation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchInformation = async () => {
            try {
                const response = await getInformationOfUserAction();
                setInformation(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchInformation();
    }, []);

    return { information, loading, error };
}
