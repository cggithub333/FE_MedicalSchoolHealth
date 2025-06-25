import request from "../../request";

export const getHealthCheckDiseaseByPupilId = async (pupilId) =>
    request.get(`sensitive_disease?pupil_id=${pupilId}`);
