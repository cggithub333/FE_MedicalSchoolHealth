
import { getAllNotificationCallback } from '../../parent-requests-callback/health-check/get-all-notification-callback';
import { fetchResponse } from '@api/fetch-response';

export const getAllNotificationAction = async () => {

    try {
      const callback = () => getAllNotificationCallback();
      const response = await fetchResponse(callback);

      //debug:
      // console.log("getAllNotificationAction response: ", response);

      const notifications = await response.data;

      return notifications || [];
    }
    catch (error) {
      console.error("Error in getAllNotificationAction:", error);
      throw error; // Re-throw the error to be handled by the caller
    }
}