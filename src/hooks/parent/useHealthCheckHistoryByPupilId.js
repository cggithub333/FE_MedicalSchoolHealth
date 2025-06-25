import { useEffect, useState } from "react";

import { fetchHealthCheckHistoryByPupilId } from "../../api/parent/parent-requests-action/pupil-request-action";

const useHealthCheckHistoryByPupilId = () => {

  const [healthCheckHistoryList, setHealthCheckHistoryList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {

    // Retrieve pupilId from local storage:
    // Ensure that the pupilId is stored in local storage before using this hook.
    const pupilId = localStorage.getItem('pupilId');
    if (!pupilId) {
      console.error('Pupil ID not found in local storage');
      setHealthCheckHistoryList([]);
      return ;
    }

    const fetcher = async () => {
      try {
        setIsLoading(true);
        const healthCheckHistories = await fetchHealthCheckHistoryByPupilId(pupilId);
        if (!healthCheckHistories) {
          throw new Error('Failed to fetch health check history');
        }

        console.log('Health Check History:', healthCheckHistories);

        setHealthCheckHistoryList(healthCheckHistories);
      } catch (err) {
        console.error('Error fetching health check history:', err);
        setHealthCheckHistoryList([]);
        throw err; // re-throw the error for further handling if needed
      } finally {
        setIsLoading(false);
      }
    }

    fetcher();
  }, []);

  return { 
    healthCheckHistoryList: healthCheckHistoryList, 
    isLoading: isLoading
  };
}

export default useHealthCheckHistoryByPupilId;