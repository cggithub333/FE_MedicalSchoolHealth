import request from "@api/request";

export const getAllMedicalEventByPupilIdCallback = async (pupilId) => {
    return request.get(`medical-events/pupil/${pupilId}`);
};
