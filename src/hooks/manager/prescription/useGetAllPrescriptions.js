
import { getAllPrescriptionsAction } from "@api/manager/manager-requests-action/prescription/get-all-prescriptions-action";
import { useState, useEffect, useCallback } from "react";

const useGetAllPrescriptions = () => {
  
  const [allPrescriptions, setAllPrescriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAllPrescriptions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const prescriptions = await getAllPrescriptionsAction();
      setAllPrescriptions(prescriptions);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {

    const fetchData = async () => await fetchAllPrescriptions();

    fetchData();

  }, [fetchAllPrescriptions]);

  return {
    allPrescriptions,
    loading,
    error,
    refetch: fetchAllPrescriptions
  };
}

export default useGetAllPrescriptions;