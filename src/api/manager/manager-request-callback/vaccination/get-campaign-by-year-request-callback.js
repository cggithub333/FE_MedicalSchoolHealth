import request from "../../../request.js";

export const getVaccinationCampaignByYear = async (year) => request.get(`getAllVaccinationCampaigns/?year=${year}`);
