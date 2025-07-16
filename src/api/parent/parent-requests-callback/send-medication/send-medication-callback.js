
import Request from "@api/request";

export const sendMedicationCallback = async (formData) => {
  
  return Request.post('send-medication', formData);
}