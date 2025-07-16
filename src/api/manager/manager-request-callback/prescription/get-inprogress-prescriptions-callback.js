
import Request from "@api/request";

export const getInProgressPrescriptionsCallback = async () => {
  return Request.get("send-medication/allByInProgress");
}