
import { sendHealthCheckSurveyAction } from "@api/parent/parent-requests-action/health-check/send-health-check-survey-action";
import { useState, useCallback } from "react";

const useSendHealthCheckSurvey = () => {
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendHealthCheckSurvey = useCallback(async (confirmationData) => {
    setLoading(true);
    setError(null);
    
    try {
      await sendHealthCheckSurveyAction(confirmationData);
    } catch (err) {
      setError(err);
      throw new Error(`Error sending health check survey: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    sendHealthCheckSurvey,
    loading,
    error
  }
}

export default useSendHealthCheckSurvey;