
import { getAllLogsByMedicationIdAndDateAction } from "@api/manager/manager-requests-action/prescription/get-all-logs-by-medicationid-and-date-action";
import { useState, useEffect, useCallback } from "react";

const useAllLogsByMedicationIdAndDate = (sendMedicationId, dateObj) => {
  const [prescriptionLogs, setPrescriptionLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchLogs = useCallback(async (localSendMedicationId, localDateObj) => {
    try {
      setLoading(true);
      const logs = await getAllLogsByMedicationIdAndDateAction(localSendMedicationId, localDateObj);
      setPrescriptionLogs(logs);
    } catch (err) {
      // console.error("Error fetching medication logs:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [sendMedicationId, dateObj, fetchLogs]);

  return { 
    prescriptionLogs, 
    loading, 
    error,
    fetchLogs
  };
}

export default useAllLogsByMedicationIdAndDate;