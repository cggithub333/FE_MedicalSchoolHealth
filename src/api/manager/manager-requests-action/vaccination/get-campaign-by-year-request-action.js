import { fetchResponse } from "../../../fetch-response";
import { getVaccinationCampaignByYear } from "../../manager-request-callback/vaccination/get-campaign-by-year-request-callback";

// This function fetches vaccination campaigns by year
export const fetchVaccinationCampaignByYear = async (year) => {
    try {
        const response = await fetchResponse(() => getVaccinationCampaignByYear(year));

        if (response.status === false)
            throw new Error("Can't fetch campaigns by year");

        const campaignsByYear = response.data;
        return campaignsByYear;

    } catch (error) {
        console.error("Error : " + error);
        throw error; // Re-throw the error to handle it in the component
    }
}