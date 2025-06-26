import request from "../../../request.js";

// delete campaign (unfinished  - needs to be completed)
export const deleteCampaign = async (campaignId) => {
    request.delete(`management/health-check-campaigns/${campaignId}`)
        .then(response => {
            console.log("Campaign deleted successfully:", response);
        })
        .catch(error => {
            console.error("Error deleting campaign:", error);
        });
}
