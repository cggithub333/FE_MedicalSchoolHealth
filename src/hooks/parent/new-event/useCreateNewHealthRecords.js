import { useState, useEffect } from "react";
import { createNewHealthRecordsAction } from "@api/parent/parent-requests-action/new-event/create-new-health-records-action";

export const useCreateNewHealthRecords = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const createNewHealthRecords = async (data) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await createNewHealthRecordsAction(data);
            return response;
        } catch (err) {
            console.error("Error creating new health records:", err);
            setError(err);
            throw err; // Re-throw the error to handle it in the component
        } finally {
            setIsLoading(false);
        }
    };

    return { createNewHealthRecords, isLoading, error };
}