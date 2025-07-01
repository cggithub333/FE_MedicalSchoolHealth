import { fetchResponse } from "../../../fetch-response";
import { getConsentFormVaccinationByStatus } from "../../schoolnurse-requests-callback/vaccination/get-consent-form-vaccination-by-status-callback";

export const fetchConsentFormVaccinationByStatus = async (campaignId, status) => {
    try {
        const response = await fetchResponse(() =>
            getConsentFormVaccinationByStatus(campaignId, status)
        );

        if (response.status === false)
            throw new Error("Can't fetch consent form vaccination by status");

        return response.data;

    } catch (error) {
        console.error("Error : " + error);
        throw error;
    }
}