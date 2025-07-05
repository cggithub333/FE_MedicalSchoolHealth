import { fetchResponse } from "@api/fetch-response";
import { getAllMedicalEventByPupilIdCallback } from "@api/schoolnurse/schoolnurse-requests-callback/new-event/get-medical-event-by-pupilsId-callback";

export const getAllMedicalEventByPupilId = async (pupilId) => {
    try {
        const response = await getAllMedicalEventByPupilIdCallback(pupilId);
        return fetchResponse(response);
    } catch (error) {
        console.error("Error fetching medical events by pupil ID:", error);
        throw error;
    }
}