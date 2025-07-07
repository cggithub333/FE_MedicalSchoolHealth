
import { getAllPendingPrescriptionsAction } from '@api/schoolnurse/schoolnurse-requests-action/send-medication/get-all-pending-prescriptions-action';
import { useState, useEffect, useCallback } from 'react';

const useAllPendingPrescriptions = () => {

  const [pendingMedicationRequests, setPendingMedicationRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAllPendingPrescriptions = useCallback(async () => {

    setLoading(true);
    try {
      const pendingPrescriptions = await getAllPendingPrescriptionsAction();
      setPendingMedicationRequests(pendingPrescriptions);
    } catch (error) {
      console.error("Error fetching all pending prescriptions:", error);
      setError(error);
      setPendingMedicationRequests([]);
    } finally {
      setLoading(false);
    }

  }, []);

  useEffect(() => {
    const fetcher = async () => {
      fetchAllPendingPrescriptions();
    }
    fetcher();
  }, []);

  return { 
    pendingMedicationRequests, 
    loading, 
    error, 
    refetch: fetchAllPendingPrescriptions
  };
}

export default useAllPendingPrescriptions;