import { fetchResponse } from "@api/fetch-response";
import { getNotiForPupilsNewEventCallback } from "@api/parent/parent-requests-callback/new-event/get-noti-for-pupils-new-event-callback";

export const getNotiForPupilsNewEventAction = async () => {
    try {
        const response = await getNotiForPupilsNewEventCallback();
        return fetchResponse(response);
    } catch (error) {
        console.error("Error fetching notifications for pupils' new events:", error);
        throw error;
    }

}