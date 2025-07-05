
import { fetchResponse } from "@api/fetch-response";
import { sendHealthCheckSurveyCallback } from "@api/parent/parent-requests-callback/health-check/send-health-check-survey-callback";

export const sendHealthCheckSurveyAction = async (confirmationData) => {

  try {

    const callback = () => sendHealthCheckSurveyCallback(confirmationData);

    const response = await fetchResponse(callback);

    // debug:
    console.log("Health check survey response:", response);

    if (response.status >= 400 || response.error) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

  } catch (error) {
    console.error("Error sending health check survey:", error);
    throw error;
  }
}