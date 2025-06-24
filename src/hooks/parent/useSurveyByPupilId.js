
import { useEffect, useState } from 'react';
import { fetchSurveyByPupilId } from '../../api/parent/parent-requests-action/pupil-request-action';
import usePupils from './usePupils';

const useSurveyByPupilId = () => {

  // get pupilId from localStorage:
  let pupilId = window.localStorage.getItem('pupilId'); 

  if (!pupilId) {
    return {
      chooseChild: false // force to choose his/her child
    }
  }

  // apply useState for storing data:
  const [ survey, setSurvey ] = useState([]);
  const [ isLoading, setIsLoading ] = useState(false);

  useEffect(() => {

    const surveyFetcher = async () => {

      setIsLoading(true);
      try {
        const fetchedSurvey = (await fetchSurveyByPupilId(pupilId))[0];

        setSurvey(fetchedSurvey);
      
      } catch(error) {
        console.error("useSurveyByPupilId.js: " + error);

      } finally {
        setIsLoading(false);
      }
    }

    surveyFetcher();

  }, []);

  return {
    chooseChild: true,
    survey: survey,
    isLoading: isLoading
  }
}

export default useSurveyByPupilId;