
import { useEffect, useState } from 'react';
import { fetchSurveyByPupilId } from '../../api/parent/parent-requests-action/pupil-request-action';
import usePupils from './usePupils';

import { Base64 } from 'js-base64';

const savePupilInforToLocalStorage = (pupil) => {
  window.localStorage.setItem('pupilId', pupil.pupilId);
  window.localStorage.setItem('pupilGender', pupil.gender);
  window.localStorage.setItem('pupilName', `${pupil.lastName} ${pupil.firstName}}`);
  const encodedInfor = Base64.encode(JSON.stringify(pupil));
  window.localStorage.setItem('pupilInfor', encodedInfor);
  location.reload();
} 

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