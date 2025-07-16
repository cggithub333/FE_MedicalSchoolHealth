import request from "@api/request";

export const getAllEquipmentMedicalCallback = async () => request.get("equipment")