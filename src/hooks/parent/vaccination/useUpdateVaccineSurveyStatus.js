
import { updateSurveyStatusAction } from '@api/parent/parent-requests-action/vaccination/update-survey-status-action';

import { useState, useEffect, useCallback } from 'react';

const useUpdateVaccineSurveyStatus = (consentFormId, status) => {
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const [responseData, setResponseData] = useState(null);

  // Define the updateStatus function using useCallback to memoize it
  // This function will be called to update the vaccine survey status
  const updateStatus = useCallback(async (fncConsentFormId, fncStatus) => {

    setUpdateLoading(true);
    setUpdateError(null);

    try {
      const result = await updateSurveyStatusAction(fncConsentFormId, fncStatus);
      setResponseData(result);
    } catch (err) {
      setUpdateError(err);
      console.error("Error updating vaccine survey status:", err);
    } finally {
      setUpdateLoading(false);
    }
  }, []);

  // Use useEffect to trigger the updateStatus function when consentFormId or status changes
  // This ensures that the function is called when the component mounts or when these values change
  useEffect(() => {
    if (consentFormId && status) {
      updateStatus();
    }
  }, []);

  return { 
    updateStatus,
    updateLoading, 
    updateError, 
    responseData 
  };
}

export default useUpdateVaccineSurveyStatus;