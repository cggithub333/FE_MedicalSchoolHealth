import request from "../../../request";

export const updateNewVaccinationCampaign = async (data) => {
    return request.put(`vaccination-campaigns/${data.id}`, data);
}