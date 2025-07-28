
import { getHealthCheckHistoryCallback} from '../../parent-requests-callback/health-check/get-health-check-history-callback';

import { fetchResponse } from '@api/fetch-response';

export const getHealthCheckHistoryByPupilIdSchoolYear = async (pupilId, schoolYear) => {

  try {

    const callback = () => getHealthCheckHistoryCallback(pupilId, schoolYear);

    const response = await fetchResponse(callback);
    //debug:
    // console.log('getHealthCheckHistoryByPupilIdSchoolYear response:', response);

    return await response.data;
    
  } catch(error) {
    console.error('Error in getHealthCheckHistoryByPupilIdSchoolYear:', error);
    throw error; // Re-throw the error for further handling if needed
  }
}