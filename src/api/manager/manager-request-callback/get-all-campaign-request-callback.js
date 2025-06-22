import request from "../../request.js";

export const getAllCampaigns = async () => request.get("getallcampaign");
