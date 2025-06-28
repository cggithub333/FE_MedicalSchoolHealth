import Request from "../../../request";

export const getPupilsByGradeAndStatus = async (campaignId) => Request.get(`consent-forms/pupils/approved-by-grade/${campaignId}`);
