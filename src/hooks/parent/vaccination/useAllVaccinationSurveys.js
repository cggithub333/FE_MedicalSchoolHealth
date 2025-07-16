
import { useState, useEffect, useCallback } from 'react';
import { getVaccinationSurveyAction } from '@api/parent/parent-requests-action/vaccination/get-vaccination-survey-action';

const useAllVaccinationSurveys = () => {

  const [ vaccinationSurveys, setVaccinationSurveys ] = useState([]);
  const [ loading, setLoading ] = useState(false);
  const [ error, setError ] = useState(null);

  const fetchVaccinationSurveys = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const surveys = await getVaccinationSurveyAction();

      //debug:
      // console.log("Fetched vaccination surveys:", surveys);

      setVaccinationSurveys(surveys);
    } catch (err) {
      setError(err);
      console.error("Error fetching vaccination surveys:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVaccinationSurveys();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array to run only once on mount

  return {
    vaccinationSurveys,
    loading,
    error,
    refetch: fetchVaccinationSurveys
  };
}

export default useAllVaccinationSurveys;