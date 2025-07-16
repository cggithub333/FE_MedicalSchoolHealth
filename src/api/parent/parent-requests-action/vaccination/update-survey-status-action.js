

import { updateSurveyStatusCallback } from '../../parent-requests-callback/vaccination/update-survey-status-callback'
import { fetchResponse } from '@api/fetch-response'

export const updateSurveyStatusAction = async (consentFormId, status) => {
  try {

    const callback = () => updateSurveyStatusCallback(consentFormId, status);

    const response = await fetchResponse(callback); 

    // debug:
    console.log("Response from updateSurveyStatusAction:", response);

    if (response.status === false) {
      throw new Error(`Error updating survey status: ${response.statusText}`);
    }

    const data = await response.data;

    // debug:
    console.log("Data from updateSurveyStatusAction:", data);

    return data;
    
  } catch (error) {
    console.error("Failed to update survey status:", error);
    throw error;
  }
}