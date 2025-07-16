import Request from "@api/request";

export const getNofityNewMedicalEventsCallback = async () => Request.get(`medical-events/parent/my-children`);