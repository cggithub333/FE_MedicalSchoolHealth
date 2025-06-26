import request from "../../../request.js";

export const getAllVaccinationDiseases = async () => request.get("diseases/vaccines");

