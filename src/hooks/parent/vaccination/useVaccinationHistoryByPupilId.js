
import { getVaccinationHistoryPupilIdAction } from "@api/parent/parent-requests-action/vaccination/get-vaccination-history-pupilId-action";
import { useState, useEffect, useCallback } from "react";

const useVaccinationHistoryByPupilId = (pupilId) => {

  //debug:
  // console.log("useVaccinationHIstory runned");

  // states:
  const [vaccinationHistoryRecords, setVaccinationHistoryRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // call back for reducing re-renders `refetch function`;
  const fetchVaccinationHistory = useCallback(async (localPupilId) => {
    setLoading(true);
    setError(null);
    try {
      const historyRecords = await getVaccinationHistoryPupilIdAction(localPupilId);
      setVaccinationHistoryRecords(historyRecords);
    } catch (err) {
      console.error(`Error fetching vaccination history for pupil with id = ${localPupilId}`, err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVaccinationHistory(pupilId);
  }, []);

  return {
    vaccinationHistoryRecords,
    loading,
    error,
    refetch: fetchVaccinationHistory
  }

}
export default useVaccinationHistoryByPupilId;