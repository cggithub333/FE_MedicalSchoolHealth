
import { fetchResponse } from '../../fetch-response';
import { getAllPupils } from '../parent-requests-callback/pupil-request-callback'; 

export const fetchAllPupils = async () => {

  try {
    const resp = await fetchResponse(getAllPupils);

    if (resp.status === false)
      throw new Error("pupilRequestAction.js: Can't fetch pupils!");

    // no errors:
    return resp.data;

  } catch(error) {
    console.error("pupilRequestAction.js: Can't fetch pupils!");
    console.error("details: " + error);
    throw error; // throw for far processing in other components;
  }
}