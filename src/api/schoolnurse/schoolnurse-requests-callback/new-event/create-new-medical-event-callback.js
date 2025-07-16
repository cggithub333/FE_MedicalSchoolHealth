import request from "@api/request";

export const createNewMedicalEventCallback = (data) => {
    return request.post("medical-events", data);
}