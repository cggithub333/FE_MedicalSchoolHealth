
import { fetchResponse } from '../../fetch-response';
import { 
  getAllPupils, 
  getSurveyByPupilId,
  getVaccinationSurvey,
  getVaccinationHistoryByPupilId
} from '../parent-requests-callback/pupil-request-callback'; 

export const fetchAllPupils = async () => {

  try {
    const resp = await fetchResponse(getAllPupils);

    if (resp.status === false)
      throw new Error("pupilRequestAction.js: Can't fetch pupils!");

    const pupils = await resp.data;
    // no errors:
    return pupils;

  } catch(error) {
    console.error("pupilRequestAction.js: Can't fetch pupils!");
    console.error("details: " + error);
    throw error; // throw for far processing in other components;
  }
}

export const fetchSurveyByPupilId = async (pupilId) => {
  try {

    const getProperCallback = () => getSurveyByPupilId(pupilId);

    const resp = await fetchResponse(getProperCallback);
    
    if (resp.status === false)
      throw new Error("pupilRequestAction.js: Can't fetch surveys!");

    // no errors:
    return await resp.data;

  } catch(error) {
    console.error("pupilRequestAction.js: Can't fetch surveys!");
    console.error("details: " + error);
    throw error; // throw for far processing in other components;
  }
}

export const fetchVaccinationSurvey = async () => {
  try {

    const getProperCallback = () => getVaccinationSurvey();

    const resp = await fetchResponse(getProperCallback);

    if (resp.status === false)
      throw new Error("pupilRequestAction.js: Can't fetch vaccination surveys!");

    // no errors:
    return await resp.data;

  } catch (error) {
    console.error("pupilRequestAction.js: Can't fetch vaccination surveys!");
    console.error("details: " + error);
    throw error; // throw for far processing in other components;
  }
}

export const fetchVaccinationHistoryByPupilId = async (pupilId) => {


  try {

    const getProperCallback = () => getVaccinationHistoryByPupilId(pupilId);

    const resp = await fetchResponse(getProperCallback);

    if (resp.status === false)
      throw new Error(`pupilRequestAction.js: Can't fetch vaccination history of pupilId=${pupilId}!`);

    // no errors:
    return await resp.data;

  } catch (error) {
    console.error(`pupilRequestAction.js:  Can't fetch vaccination history of pupilId=${pupilId}!`);
    console.error("details: " + error);
    throw error; // throw for far processing in other components;
  }
}