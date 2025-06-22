import request from "../../request";
// ✅ Use a parameter, no quotes in URL:
export const getCampaignsByStatus = async (statusArray) => {
    return request.get("getallcampaign", {
        params: { status: statusArray }  // Axios or your request lib handles array properly.
    });
};
