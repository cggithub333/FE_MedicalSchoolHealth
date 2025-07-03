
import { deleteSendMedicationByIdAction } from '@api/parent/parent-requests-action/send-medication/delete-sendmedication-by-id-action';
import { useState, useEffect} from 'react';

const useDeleteSendMedicationById = () => {

  const [ responseData, setResponseData ] = useState(null);
  const [ loading, setLoading ] = useState(false);
  const [ error, setError ] = useState(null);

  const deleteSendMedicationWithId = async (sendMedicationId) => {

    setLoading(true);
    try {
      const responseData = await deleteSendMedicationByIdAction(sendMedicationId);

      // debug:
      console.log(">>>>>>>>>> useDeleteSendMedicationById responseData: ", responseData);


      if (responseData) {
        setResponseData(responseData);
      }
    } catch(error) {
      //debug:
      console.log("useDeleteSendMedicationById error: ", error);
      setError(error);
    } finally {
      setLoading(false);
    }

  }

  return {
    responseData,
    loading,
    error,
    deleteSendMedicationWithId
  }

}

export default useDeleteSendMedicationById