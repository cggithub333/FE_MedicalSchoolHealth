import request from "../../../request";

export const getPupilsByGrade = async (grade) => request.get(`management/health-check/annual/student/${grade}`);


