
import Request from "@api/request";

export const updatePrescriptionStatusCallback = async (sendMedicationId, status) => {
  
  return Request.patch(`send-medication/${sendMedicationId}`, {
    statusSendMedication: status
  })
}