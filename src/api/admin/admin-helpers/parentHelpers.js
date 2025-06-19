
import {fetchResponse} from "../Helper";
import { 
  requestAllPupils,
  requestAllVaccinationHistoryByPupilId,
  requestAllVaccinationSurveyByPupilId
} from "../requests/parentRequests";

export const getAllPupils = async () => {

  try {
    const response = await fetchResponse(requestAllPupils);

    if (response.status === false) {
      throw new Error("Can't request all pupils");
    }

    //else:
    const pupils = await response.data;
    console.log(pupils); // test in console log;
    return pupils;
  
  } catch(error) {
    console.error(error);
    throw error; // Re-throw the error to handle it in the component
  } 
}

export const getAllVaccinationHistoryByPupilId = async (pupilId) => {
  try {
    /* old code (not working): 

      const response = await fetchResponse(requestAllVaccinationHistory(pupilId)); (1)
      
      because: (1) = await fetchReponse(promiseDatatype); // the 'requestAllVaccinationHistory(pupilId)' runs to be a promise before passed into the fetchReponse;

      while the fetchReponse need a "callback" function inside it. 
    
    */
    const response = await fetchResponse(() => requestAllVaccinationHistoryByPupilId(pupilId));

    if (response.status === false)
      throw new Error("Can't fetch vaccination history with pupilId=" + pupilId);
  
    //else: success
    const vaccinationHistories = response.data;
    console.log(response);
    console.log(vaccinationHistories); // test in console log;
    return vaccinationHistories;  // return array of vaccination history;

  } catch(error) {
    console.error(error);
    throw error; // Re-throw the error to handle it in the component
  }
}

export const getAllVaccinationSurveyByPupilId = async (pupilId) => {

  try {
    const response = await fetchResponse(() => requestAllVaccinationSurveyByPupilId(pupilId));

    if (response.status === false)
      throw new Error("Can't fetch vaccination survey with pupilId=" + pupilId);

    const vaccinationSurveys = response.data;
    return vaccinationSurveys;
  
  } catch(error) {
    console.error("Error at parentHelpers.js: " + error);
    throw error; // Re-throw the error to handle it in the component
  }
}
