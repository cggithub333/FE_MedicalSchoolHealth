import Request from "../../request";


export const getPupilsByGrade = async (grade) => Request.get(`pupils/?Grade=${grade}`);


