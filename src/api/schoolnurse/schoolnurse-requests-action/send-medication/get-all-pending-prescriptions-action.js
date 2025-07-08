
import {getAllPendingPrescriptionsCallback} from '@api/schoolnurse/schoolnurse-requests-callback/send-medication/get-all-pending-prescriptions-callback'
import { fetchResponse } from '@api/fetch-response'

export const getAllPendingPrescriptionsAction = async () => {

  try {
    const callback = () => getAllPendingPrescriptionsCallback();

    const response = await fetchResponse(callback);

    // debug:
    console.log("getAllPendingPrescriptionsAction response: ", response);

    const pendingMedicationRequests = await response.data || []; 
    return pendingMedicationRequests

  } catch(error) {
    throw error; // Re-throw the error to be handled by the caller
  }
}