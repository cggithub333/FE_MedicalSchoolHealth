import { fetchResponse } from "../../../fetch-response";
import { getVaccinationHistoryByPupilsIdCallback } from "../../schoolnurse-requests-callback/new-event/use-get-vaccination-by-pupilId-callback";


export const getVaccinationHistoryByPupilsIdAction = async (pupilsId) => {
    try {
        const response = await fetchResponse(() => getVaccinationHistoryByPupilsIdCallback(pupilsId));
        if (response.status === false) {
            throw new Error(response.message || "Failed to fetch vaccination history");
        }

        // Return the full response object so the hook can access response.data
        return response;
    } catch (error) {
        console.error("Error fetching vaccination history:", error);
        throw error; // Re-throw the error to be handled by the caller
    }
};