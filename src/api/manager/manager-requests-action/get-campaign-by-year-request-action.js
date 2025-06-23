import { fetchResponse } from "../../fetch-response";
import { getCampaignByYear } from "../manager-request-callback/get-campaign-by-year-request-callback";

export const fetchCampaignByYear = async (year) => {
    try {
        const response = await fetchResponse(() => getCampaignByYear(year));

        if (response.status === false)
            throw new Error("Can't fetch campaigns by year");

        const campaignsByYear = response.data;
        return campaignsByYear;

    } catch (error) {
        console.error("Error : " + error);
        throw error; // Re-throw the error to handle it in the component
    }
}