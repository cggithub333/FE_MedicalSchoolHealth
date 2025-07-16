import request from "../../../request";

export const getConsentFormVaccinationByStatus = async (campaignId, status) => {
    // Only include status param if it is a non-empty string
    const params = {};
    if (status) {
        params.status = status;
    }
    return request.get(`consent-forms/campaign/${campaignId}`, {
        params
    });
}
