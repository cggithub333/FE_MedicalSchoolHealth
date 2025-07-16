import { fetchResponse } from "@api/fetch-response";
import { getAllMedicalEventByPupilIdCallback } from "@api/schoolnurse/schoolnurse-requests-callback/new-event/get-medical-event-by-pupilsId-callback";

export const getAllMedicalEventByPupilId = async (pupilId) => {
    try {
        // Correct: pass a function to fetchResponse
        const response = await fetchResponse(() => getAllMedicalEventByPupilIdCallback(pupilId));
        return response;
    } catch (error) {
        console.error("Error fetching medical events by pupil ID:", error);
        throw error;
    }
}