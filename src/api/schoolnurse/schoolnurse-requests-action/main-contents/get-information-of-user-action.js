import { fetchResponse } from "@api/fetch-response";
import { getInformationOfUserCallback } from "../../schoolnurse-requests-callback/main-contents/get-information-of-user-callback.js";

export const getInformationOfUserAction = async () => {
    const syncCallbackRequest = getInformationOfUserCallback;
    const response = await fetchResponse(syncCallbackRequest);
    if (response.status) {
        return response;
    } else {
        throw new Error(response.error);
    }
}