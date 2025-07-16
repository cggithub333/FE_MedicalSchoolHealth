
import { MedicationPreparationAction } from "@api/schoolnurse/schoolnurse-requests-action/send-medication/medication-preparation-action"
import { useEffect, useState, useCallback } from "react"

const useMedicationPreparation = (grade, session) => {

  const [medicationPreparations, setMedicationPreparations] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)


  const fetchMedicationPreparations = useCallback(async (localGrade, localSession) => {

    setLoading(true)
    setError(null)

    try {
      const preparations = await MedicationPreparationAction(localGrade, localSession);
      setMedicationPreparations(preparations)
    }
    catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }, []);// run once on mount


  useEffect(() => {
    const fetcher = async() => {
      await fetchMedicationPreparations();
    }

    fetcher();
  }, [fetchMedicationPreparations, grade, session]);

  return { medicationPreparations, loading, error, refetch: fetchMedicationPreparations};
}

export default useMedicationPreparation;