import { useState, useEffect } from 'react';
import { fetchVaccinationHistoryByPupilId } from '../../api/parent/parent-requests-action/pupil-request-action';

const useVaccinationHistoryByPupilId = () => {
  const [vaccinationHistory, setVaccinationHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const pupilId = localStorage.getItem('pupilId');
    if (!pupilId) return;
    const fetchHistory = async () => {
      setIsLoading(true);
      try {
        const fetchedHistory = await fetchVaccinationHistoryByPupilId(pupilId);
        setVaccinationHistory(fetchedHistory);
      } catch (error) {
        console.error("useVaccinationHistoryByPupilId.js: " + err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, []);

  return {
    vaccinationHistory: vaccinationHistory,
    isLoading: isLoading
  };
};

export default useVaccinationHistoryByPupilId; 