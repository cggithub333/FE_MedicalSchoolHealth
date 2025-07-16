
import Request from "@api/request";

export const deletePrescriptionByIdCallback = async (sendMedicationId) => {
  return Request.delete(`send-medication/delete/${sendMedicationId}`);
}