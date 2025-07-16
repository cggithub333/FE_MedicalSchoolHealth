import { fetchResponse } from "../../../fetch-response";
import { getHealthCheckGenitalDiseaseCallback } from "../../../manager/manager-request-callback/healthcheck/get-health-check-genital-disease-callback";

export const getHealthCheckGenitalDiseaseAction = async () => {
    try {
        const response = await fetchResponse(() => getHealthCheckGenitalDiseaseCallback());
        return response;
    } catch (error) {
        return fetchResponse(error.response);
    }
}