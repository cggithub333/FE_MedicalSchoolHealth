import request from "../../../request";

export const getHealthCheckGenitalDiseaseCallback = async () => request.get("diseases/injected-vaccination-false");