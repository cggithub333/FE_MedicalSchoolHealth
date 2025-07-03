
import { deletePrescriptionByIdCallback } from '@api/parent/parent-requests-callback/send-medication/delete-sendmedication-by-id-callback';
import { fetchResponse } from '@api/fetch-response';

export const deleteSendMedicationByIdAction = async (sendMedicationId) => {

  try {
    const callback = () => deletePrescriptionByIdCallback(sendMedicationId);
    
    const response = await fetchResponse(callback);

    // debug:
    console.log("delete sendMedication's Response:", response);

    const responseData = await response.data;

    return responseData;

  } catch(error) {
    console.error("deleteSendMedicationByIDAction: ", error);
    throw error;
  }
}
