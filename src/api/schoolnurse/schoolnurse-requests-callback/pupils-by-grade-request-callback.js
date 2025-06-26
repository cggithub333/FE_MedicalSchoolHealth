import Request from "../../request";


export const getPupilsByGrade = async (grade) => Request.get(`/management/health-check-campaign/${grade}`);


