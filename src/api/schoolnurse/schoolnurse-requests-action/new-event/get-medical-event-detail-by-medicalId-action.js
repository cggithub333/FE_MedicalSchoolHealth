import { fetchResponse } from "@api/fetch-response";
import { getMedicalEventByMedicalIdCallback } from "@api/schoolnurse/schoolnurse-requests-callback/new-event/get-medical-event-detail-by-medicalId-callback";

export const getMedicalEventDetailByMedicalIdAction = async (id) => {
    try {
        const response = await fetchResponse(() => getMedicalEventByMedicalIdCallback(id));
        return response;
    } catch (error) {
        console.error("Error fetching medical event detail by medical ID:", error);
        throw error;
    }
}