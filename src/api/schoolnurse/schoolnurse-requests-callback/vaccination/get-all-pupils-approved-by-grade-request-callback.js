import request from "@api/request";

export const getPupilsByGradeAndStatus = async (campaignId) => request.get(`consent-forms/pupils/approved-by-grade/${campaignId}`);