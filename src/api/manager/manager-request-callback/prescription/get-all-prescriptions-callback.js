
import Request from "@api/request";

export const getAllPrescriptionsCallback = async () => {
  return Request.get("send-medication/allSendMedication");
}