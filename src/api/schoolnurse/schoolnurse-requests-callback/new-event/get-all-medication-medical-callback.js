import request from "@api/request";

export const getAllMedicaionMedicalCallback = async () => request.get("medication")