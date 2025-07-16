import { fetchResponse } from "@api/fetch-response";
import { createNewMedicalEventCallback } from "@api/schoolnurse/schoolnurse-requests-callback/new-event/create-new-medical-event-callback";

const createNewMedicalEventAction = async (data) => {
    const syncCallbackRequest = () => createNewMedicalEventCallback(data);

    const response = await fetchResponse(syncCallbackRequest);

    if (response.status) {
        return response;
    } else {
        throw new Error(response.error);
    }
}
export default createNewMedicalEventAction;