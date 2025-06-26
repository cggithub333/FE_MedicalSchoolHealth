import request from "../../../request.js";

export const getVaccinationCampaign = async () => request.get("vaccination-campaigns/all");
