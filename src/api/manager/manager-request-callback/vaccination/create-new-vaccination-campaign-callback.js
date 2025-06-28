import request from "../../../request";

export const createNewVaccinationCampaign = async (data) => request.post("vaccination-campaigns", data)