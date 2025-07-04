
import Request from "@api/request";

export const createTakeMedicationLogsCallback = async (medicationLog) => {
  return Request.post(`send-medication/medicationLog`, medicationLog);
}