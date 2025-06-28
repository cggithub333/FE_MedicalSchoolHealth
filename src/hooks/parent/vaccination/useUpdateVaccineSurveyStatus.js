
import { updateSurveyStatusAction } from '@api/parent/parent-requests-action/vaccination/update-survey-status-action';

import { useState, useEffect, useCallback } from 'react';

const useUpdateVaccineSurveyStatus = (consentFormId, status) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [responseData, setResponseData] = useState(null);

  // Define the updateStatus function using useCallback to memoize it
  // This function will be called to update the vaccine survey status
  const updateStatus = useCallback(async (fncConsentFormId, fncStatus) => {

    setLoading(true);
    setError(null);

    try {
      const result = await updateSurveyStatusAction(fncConsentFormId, fncStatus);
      setResponseData(result);
    } catch (err) {
      setError(err);
      console.error("Error updating vaccine survey status:", err);
    } finally {
      setLoading(false);
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
    loading, 
    error, 
    responseData 
  };
}

export default useUpdateVaccineSurveyStatus;