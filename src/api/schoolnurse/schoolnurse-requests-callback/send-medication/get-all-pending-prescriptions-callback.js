
import Request from "@api/request";

export const getAllPendingPrescriptionsCallback = async () => {
  return Request.get("send-medication/pending");
}