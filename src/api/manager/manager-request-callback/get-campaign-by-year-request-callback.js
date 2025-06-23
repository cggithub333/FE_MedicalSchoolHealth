import request from "../../request.js";

export const getCampaignByYear = async (year) => request.get(`getallcampaign/?year=${year}`);
