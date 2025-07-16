import Request from "@api/request";


export const getAllNotificationCallback = async () => {
  return Request.get("notification");
}