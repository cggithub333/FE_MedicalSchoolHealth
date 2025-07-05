import { fetchResponse } from "@api/fetch-response";
import { getAllHealthCheckByPupilIdCallback } from "@api/schoolnurse/schoolnurse-requests-callback/new-event/get-all-health-check-by-pupilId-callback";

export const getAllHealthCheckByPupilIdAction = async (pupilId) => {
    try {
        // Correct: pass a function to fetchResponse
        const response = await fetchResponse(() => getAllHealthCheckByPupilIdCallback(pupilId));
        return response;
    } catch (error) {
        console.error("Error fetching health checks by pupil ID:", error);
        throw error;
    }
}