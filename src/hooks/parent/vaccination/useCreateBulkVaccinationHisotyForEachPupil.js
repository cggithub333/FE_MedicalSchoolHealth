
import { createBulkVaccinationHistoryForEachPupilAction } from "@api/parent/parent-requests-action/vaccination/create-bulk-vaccination-history-for-each-pupil-action";
import { useState, useCallback } from "react";

const useCreateBulkVaccinationHistoryForEachPupil = () => {

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createBulkVaccinationHistory = useCallback(async (vaccinationHistoryData) => {
    setLoading(true);
    setError(null);

    try {
      await createBulkVaccinationHistoryForEachPupilAction(vaccinationHistoryData);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    createBulkVaccinationHistory,
    loading,
    error
  };

}

export default useCreateBulkVaccinationHistoryForEachPupil;