import { fetchResponse } from "../../fetch-response";
import { getSensitiveDisease } from "../manager-request-callback/get-sensitive-disease-request-callback";

export const fetchSensitiveDisease = async () => {
    try {
        const response = await fetchResponse(getSensitiveDisease);

        if (response.status === false) {
            throw new Error("Can't fetch sensitive diseases");
        }

        // Return the full disease objects (not just names)
        const diseases = response.data?.[0]?.sensitive_disease || [];
        return diseases;

    } catch (error) {
        console.error("Error fetching sensitive disease:", error);
        throw error;
    }
};
