
import { getVaccinationSurveyCallback } from '../../parent-requests-callback/vaccination/get-vaccination-survey-callback';
import { fetchResponse } from '@api/fetch-response';

export const getVaccinationSurveyAction = async () => {
  try {

    const callback = () => getVaccinationSurveyCallback();

    const response = await fetchResponse(callback);

    //debug:
    // console.log("Vaccination survey response:", response);

    const vaccinationSurveys = await response?.data || [];

    // debug:
    // console.log("Vaccination surveys fetched:", vaccinationSurveys);

    return vaccinationSurveys;
    
  } catch (error) {
    console.error("Error fetching vaccination survey:", error);
    throw error; // Re-throw the error for further handling if needed
  }
}