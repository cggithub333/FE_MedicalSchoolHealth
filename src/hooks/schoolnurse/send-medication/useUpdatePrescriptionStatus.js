
import { updatePrescriptionStatusAction } from "@api/schoolnurse/schoolnurse-requests-action/send-medication/update-prescription-status-action.js";
import {useState, useCallback } from "react";


const useUpdatePrescriptionStatus = () => {

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const updatePrescriptionRequest = useCallback(async (sendMedicationId, status) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      // Call the action to update the prescription status
      await updatePrescriptionStatusAction(sendMedicationId, status);

      // no errors:
      setSuccess(true);
    }
    catch (err) {
      // Handle any errors that occur during the update
      console.error("Error updating prescription status:", err);
      setError(err);
    } finally {
      // Reset loading state
      setLoading(false);
    }
  })

  return {
    updateStatus: updatePrescriptionRequest,
    error,
    loading,
    success
  };
}

export default useUpdatePrescriptionStatus;