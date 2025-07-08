import { useState, useEffect, useCallback } from "react";
import { getInProgressPrescriptionsAction } from "@api/manager/manager-requests-action/prescription/get-inprogress-prescriptions-action";

const useGetInProgressPrescriptions = () => {
  const [inProgressPrescriptions, setInProgressPrescriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchInProgressPrescriptions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const prescriptions = await getInProgressPrescriptionsAction();
      setInProgressPrescriptions(prescriptions);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {

    const fetchData = async () => await fetchInProgressPrescriptions();

    fetchData();

  }, [fetchInProgressPrescriptions]);

  return {
    inProgressPrescriptions,
    loading,
    error,
    refetch: fetchInProgressPrescriptions
  };
}

export default useGetInProgressPrescriptions;