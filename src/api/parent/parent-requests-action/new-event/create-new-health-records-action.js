import { fetchResponse } from "@api/fetch-response";
import { createNewHealthRecordsCallback } from "@api/parent/parent-requests-callback/new-event/create-new-health-records-callback";

export const createNewHealthRecordsAction = async (formData) => {
    try {
        const response = await createNewHealthRecordsCallback(formData);
        return fetchResponse(response);
    } catch (error) {
        console.error("Error creating new health records:", error);
        throw error;
    }
}