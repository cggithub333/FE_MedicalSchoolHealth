
import { getPrescriptionByPupilIdAction } from "@api/parent/parent-requests-action/send-medication/get-prescription-by-pupilid-action";
import { useState, useEffect, useCallback } from "react";

const usePrescriptionByPupil = (pupilId) => {

  const [prescriptionArr, setPrescriptionArr] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPrescription = useCallback(async (localPupilId) => {

    setLoading(true);
    setError(null);

    try {
      const fetchedPrescriptionArr = await getPrescriptionByPupilIdAction(localPupilId);

      setPrescriptionArr(fetchedPrescriptionArr);

    } catch (error) {
      console.error('Error fetching prescription:', error);
      setError(error);
      setPrescriptionArr([]); // Clear the prescription array on error
    } finally {
      setLoading(false);
    }

  }, []); // useCallback ensures that the function is not recreated on every render

  useEffect(() => {
    fetchPrescription(pupilId);
  }, []);

  return {
    prescriptionArr,
    loading,
    error,
    refetch: fetchPrescription, // Allows manual refetching
  }
}

export default usePrescriptionByPupil;