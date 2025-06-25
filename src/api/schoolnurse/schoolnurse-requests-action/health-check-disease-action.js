import { fetchResponse } from "../../fetch-response.js";
import { getHealthCheckDiseaseByPupilId } from "../schoolnurse-requests-callback/health-check-disease-callback.js";

export const fetchHealthCheckDisease = async (pupilId) => {
    try {
        const response = await fetchResponse(() => getHealthCheckDiseaseByPupilId(pupilId));

        if (response.status === false)
            throw new Error("Can't fetch health check disease");

        const HealthCheckDisease = response.data;
        return HealthCheckDisease;

    } catch (error) {
        console.error("Error : " + error);
        throw error; // Re-throw the error to handle it in the component
    }
}