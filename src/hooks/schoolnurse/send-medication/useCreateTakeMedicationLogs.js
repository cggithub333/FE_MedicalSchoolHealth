
import { createTakeMedicationLogsAction } from "@api/schoolnurse/schoolnurse-requests-action/send-medication/create-take-medication-logs-action";
import { useState, useCallback } from "react";

const useCreateTakeMedicationLogs = () => {
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const createTakeMedicationLogs = useCallback(async (medicationLog) => {
    setIsLoading(true);
    setError(null);

    try {
      // Call the action to create take medication logs
      await createTakeMedicationLogsAction(medicationLog);
      setIsLoading(false);
    } catch (err) {
      console.error("Error creating take medication logs:", err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { 
    createTakeMedicationLogs,
    isLoading,
    error
  };
}

export default useCreateTakeMedicationLogs;