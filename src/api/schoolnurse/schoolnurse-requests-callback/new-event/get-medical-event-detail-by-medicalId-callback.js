import request from "@api/request";


export const getMedicalEventByMedicalIdCallback = async (id) => request.get(`medical-events/${id}`);
