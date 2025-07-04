import { fetchResponse } from "@api/fetch-response";
import { getAllMedicationMedicalCallback } from "@api/schoolnurse/schoolnurse-requests-callback/new-event/get-medical-event-list-callback";

export const getAllMedicationMedicalAction = async () => {
    try {
        const response = await fetchResponse(getAllMedicationMedicalCallback);
        return response;
    } catch (error) {
        console.error("Error fetching medication list:", error);
        throw error;
    }
}