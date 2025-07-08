
import { getCompletedPrescriptionsAction } from "@api/manager/manager-requests-action/prescription/get-completed-prescription-action";
import { useState, useEffect, useCallback } from "react";

const useGetCompletedPrescriptions = () => {
  const [completedPrescriptions, setCompletedPrescriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCompletedPrescriptions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const prescriptions = await getCompletedPrescriptionsAction();
      setCompletedPrescriptions(prescriptions);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => await fetchCompletedPrescriptions();
    fetchData();
  }, [fetchCompletedPrescriptions]);

  return {
    completedPrescriptions,
    loading,
    error,
    refetch: fetchCompletedPrescriptions
  };
}

export default useGetCompletedPrescriptions;