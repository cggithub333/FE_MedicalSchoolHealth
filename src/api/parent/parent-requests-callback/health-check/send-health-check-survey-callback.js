
import Request from "@api/request";

export const sendHealthCheckSurveyCallback = async (confirmationData) => {
  return Request.patch(`management/health-check/annual/disease`, confirmationData);
}