import request from "@api/request";

export const getNotiForPupilsNewEventCallback = async () => request.get(`medical-events/parent/my-children`)