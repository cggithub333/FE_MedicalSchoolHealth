import { fetchResponse } from "../../fetch-response.js";
import { getHealthCheckDisease } from "../schoolnurse-requests-callback/health-check-disease-callback.js";

export const fetchHealthCheckDisease = async () => {
    try {
        const response = await fetchResponse(() => getHealthCheckDisease());

        if (response.status === false)
            throw new Error("Can't fetch health check disease");

        const HealthCheckDisease = response.data;
        return HealthCheckDisease;

    } catch (error) {
        console.error("Error : " + error);
        throw error; // Re-throw the error to handle it in the component
    }
}