
import { takeMedicationsByEachPupilEachSessionAction } from "@api/schoolnurse/schoolnurse-requests-action/send-medication/take-medications-by-each-pupil-each-session-action";
import { useState, useCallback } from "react";

const useTakeMedicationsByEachPupilEachSession = () => {

  const [medicationDetailsByPupil, setMedicationDetailsByPupil] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMedications = useCallback(async (sessionId, pupilId) => {

    setLoading(true);
    setError(null);

    try {
      const medicationDetailsByPupil = await takeMedicationsByEachPupilEachSessionAction(sessionId, pupilId);
      setMedicationDetailsByPupil(medicationDetailsByPupil);
    } catch (error) {
      console.error("Error fetching medications by pupil and session:", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  return { 
    medicationDetailsByPupil, 
    loading, 
    error, 
    refetch: fetchMedications
  };
}

export default useTakeMedicationsByEachPupilEachSession;