import request from "@api/request";

export const getAllMedicationMedicalCallback = async () => request.get("medical-events")
