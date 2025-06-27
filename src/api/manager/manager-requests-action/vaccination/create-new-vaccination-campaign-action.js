import { fetchResponse } from "../../../fetch-response";
import { createNewVaccinationCampaign } from "../../manager-request-callback/vaccination/create-new-vaccination-campaign-callback";

export const createNewVaccinationCampaignAction = async (data) => {
    try {
        const response = await fetchResponse(() =>
            createNewVaccinationCampaign(data)
        );
        console.log("API response for create campaign:", response);

        if (response.status === false)
            throw new Error("Can't create new vaccination campaign");

        const vaccinationCampaign = response.data;
        return vaccinationCampaign;

    } catch (error) {
        console.error("Error : " + error);
        throw error; // Re-throw the error to handle it in the component
    }
}
