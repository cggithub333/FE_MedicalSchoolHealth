import Request from "../../../request";

export const getPupilsByGradeAndStatus = async (campaignId, gradeLevel) => Request.get(`consent-forms/pupils/approved-by-grade/${campaignId}/grade/${gradeLevel}`);
