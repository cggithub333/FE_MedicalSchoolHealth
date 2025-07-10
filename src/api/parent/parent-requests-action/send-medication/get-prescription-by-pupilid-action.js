
import { getPrescriptionByPupilIdCallback } from '../../parent-requests-callback/send-medication/get-prescription-by-pupilid-callback';
import { fetchResponse } from '@api/fetch-response';


export const getPrescriptionByPupilIdAction = async (pupilId) => {
  try {
    const callback = () => getPrescriptionByPupilIdCallback(pupilId);

    const response = await fetchResponse(callback);

    // debug:
    // console.log('getPrescriptionByPupilIdAction response:', response);

    const prescriptionArr = await response?.data || [];
    
    return prescriptionArr;
  
  } catch (error) {
    // console.error('Error in getPrescriptionByPupilIdAction:', error);
    throw error; // Re-throw the error for further handling if needed
  }
}