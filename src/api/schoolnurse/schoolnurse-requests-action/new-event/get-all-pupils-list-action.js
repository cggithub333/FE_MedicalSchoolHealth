import { fetchResponse } from "@api/fetch-response";
import { getAllPupilsListCallback } from "@api/schoolnurse/schoolnurse-requests-callback/new-event/get-all-pupils-list-callback";

const getAllPupilsListAction = async () => {
    const syncCallbackRequest = getAllPupilsListCallback;

    const response = await fetchResponse(syncCallbackRequest);

    if (response.status) {
        return response;
    } else {
        throw new Error(response.error);
    }
}
export default getAllPupilsListAction;