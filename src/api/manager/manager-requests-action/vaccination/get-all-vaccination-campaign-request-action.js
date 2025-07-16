import { fetchResponse } from "../../../fetch-response";
import { getVaccinationCampaign } from "../../manager-request-callback/vaccination/get-all-vaccination-campaign-request-callback";

export const fetchAllVaccinationCampaigns = async () => {
    try {
        const response = await fetchResponse(() => getVaccinationCampaign());

        if (response.status === false)
            throw new Error("Can't fetch all campaigns");

        const allCampaigns = response.data;
        return allCampaigns;

    } catch (error) {
        console.error("Error : " + error);
        throw error; // Re-throw the error to handle it in the component
    }
};
