import Request from "../../../request";

export const getPupilsByGradeAndStatus = async (grade) => Request.get(`getPupilsApprovedByGrade/?Grade=${grade}`);