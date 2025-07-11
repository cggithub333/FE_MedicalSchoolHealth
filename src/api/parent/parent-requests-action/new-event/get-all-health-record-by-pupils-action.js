import { fetchResponse } from "@api/fetch-response";
import { getAllHealthRecordByPupilsCallback } from "../../parent-requests-callback/new-event/get-all-health-record-by-pupils-callback";

export const getAllHealthRecordByPupilsAction = async (pupilIds) => {
    try {
        const response = await fetchResponse(() =>
            getAllHealthRecordByPupilsCallback(pupilIds));
        return response;
    } catch (error) {
        console.error("Error in getAllHealthRecordByPupilsAction:", error);
        throw error;
    }
}