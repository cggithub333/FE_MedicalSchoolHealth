import request from "../../request";

export const getHealthCheckDisease = async () => request.get('sensitive_disease');