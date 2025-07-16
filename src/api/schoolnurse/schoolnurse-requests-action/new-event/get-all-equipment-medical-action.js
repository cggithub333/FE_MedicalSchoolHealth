import { fetchResponse } from "@api/fetch-response";
import { getAllEquipmentMedicalCallback } from "@api/schoolnurse/schoolnurse-requests-callback/new-event/get-all-equipment-medical-callback";

export const getAllEquipmentMedicalAction = async () => {
    const syncCallbackRequest = () => getAllEquipmentMedicalCallback();

    const response = await fetchResponse(syncCallbackRequest);

    if (response.status) {
        return response;
    } else {
        throw new Error(response.error);
    }
}