
import { fetchResponse } from "@api/fetch-response";
import { getNofityNewMedicalEventsCallback } from "@api/parent/parent-requests-callback/medical-events/get-notify-new-medical-events-callback";

export const getNofityNewMedicalEventsAction = async () => {
  try {
    const response = await getNofityNewMedicalEventsCallback();

    // debug:
    console.log("Fetched Notifications for Pupils' New Events:", response);

    return await response.data || []; // Return an empty array if no data is found
  } catch (error) {
    console.error("Error fetching notifications for pupils' new events:", error);
    throw error;
  }

}