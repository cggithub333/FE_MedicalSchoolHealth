import { fetchResponse } from "@api/fetch-response";
import { getAllMedicaionMedicalCallback } from "@api/schoolnurse/schoolnurse-requests-callback/new-event/get-all-medication-medical-callback";

export const getAllMedicationMedicalAction = async () => {
    const syncCallbackRequest = () => getAllMedicaionMedicalCallback();

    const response = await fetchResponse(syncCallbackRequest);

    if (response.status) {
        return response;
    } else {
        throw new Error(response.error);
    }
}