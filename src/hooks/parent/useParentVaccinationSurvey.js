import { useState, useEffect } from 'react';
import { fetchVaccinationSurvey } from '../../api/parent/parent-requests-action/pupil-request-action';

const useParentVaccinationSurvey = () => {
  const [surveys, setSurveys] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchSurvey = async () => {
      setIsLoading(true);
      try {
        const fetchedSurvey = await fetchVaccinationSurvey();
        setSurveys(fetchedSurvey);
      } catch (error) {
        console.error("useParentVaccinationSurvey.js: " + error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSurvey();
  }, []);

  return {
    surveys,
    isLoading
  };
};

export default useParentVaccinationSurvey; 