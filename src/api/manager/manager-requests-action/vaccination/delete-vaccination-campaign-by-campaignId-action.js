import { fetchResponse } from "@api/fetch-response";
import { deleteVaccinationCampaign } from "../../manager-request-callback/vaccination/delete-vaccination-campaign-by-campaignId-callback";

export const deleteVaccinationCampaignByCampaignID = async (campaignID) => {
    try {
        const response = await fetchResponse(() => deleteVaccinationCampaign(campaignID), "Deleting vaccination campaign");
        if (response.status === false) {
            throw new Error("Failed to delete vaccination campaign");
        }
        console.log("Vaccination campaign deleted successfully:", response);
        return response;
    } catch (error) {
        console.error("Error deleting vaccination campaign:", error);
        throw error; // Re-throw the error to handle it in the component
    }
}