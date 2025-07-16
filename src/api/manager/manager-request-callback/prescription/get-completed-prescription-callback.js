
import Request from "@api/request";

export const getCompletedPrescriptionsCallback = async () => {
  return Request.get('send-medication/allByComplete');
}